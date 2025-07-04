import { PathObject, PathObjectResult } from "../types";
import { Path } from "./path";

export class RouterCreator {
    private readonly origin!: string;

    constructor(origin: string) {
        Object.defineProperty(this, "origin", { value: origin, enumerable: false });
    }

    public createPathnames<Obj extends PathObject>(object: Obj): this & PathObjectResult<Obj> {
        const pathObjectResult = RouterCreator.getPathObjectResult(object, this);

        Object.assign(this, pathObjectResult);
        return this as this & PathObjectResult<Obj>;
    }

    private static getPathObjectResult<Obj extends PathObject>(
        object: Obj,
        parent: Path | RouterCreator
    ): PathObjectResult<Obj> {
        const result = {} as PathObjectResult<Obj>;
        const objectKeys = Object.keys(object);

        for (const key of objectKeys) {
            const value = object[key];

            switch (typeof value) {
                case "string":
                    (result as any)[key] = this.resultForString(value, parent);
                    break;
                case "object":
                    if (Array.isArray(value)) break;

                    if (value === null) {
                        (result as any)[key] = this.resultForNull(key, parent);
                        break;
                    }

                    (result as any)[key] = this.resultForObject(key, value, parent);
                    break;
                default:
                    break;
            }
        }

        return result;
    }

    private static resultForString(value: string, parent: Path | RouterCreator): Path {
        return new Path(value, parent);
    }

    private static resultForNull(key: string, parent: Path | RouterCreator): Path {
        return new Path(key, parent);
    }

    private static resultForObject(key: string, value: any, parent: Path | RouterCreator): Path {
        const pathStr = (value as any)._path ?? key;
        const attributes = (value as any)._att;
        const path = new Path(pathStr, parent, attributes);

        Object.assign(path, this.getPathObjectResult(value, path));

        return path;
    }

    public getOrigin(): string {
        return this.origin;
    }

    public hasPathname(path: string, where?: { attribute: string }) {
        const pathnameParts = path.split("/").filter((p) => p !== "");
        const { matched, pathTrace } = this.recursivePathMatch(pathnameParts);

        return matched && (where?.attribute ? pathTrace.some((p) => p.has(where.attribute)) : true);
    }

    private recursivePathMatch(parts: string[], path?: Path): { matched: boolean; pathTrace: Path[] } {
        const paths = RouterCreator.getPathnameChildrenOf(path ?? this);

        const [firstPart, ...rest] = parts;
        const pathExactlyMatch = paths.find((p) => p.getPath().replace("/", "") === firstPart);

        if (pathExactlyMatch && rest.length === 0) return { matched: true, pathTrace: [pathExactlyMatch] };

        if (pathExactlyMatch && rest.length > 0) {
            const { pathTrace, ...result } = this.recursivePathMatch(rest, pathExactlyMatch);
            return { ...result, pathTrace: [pathExactlyMatch, ...pathTrace] };
        }

        const paramPaths = RouterCreator.filterPathnamesWithParamNotation(paths);

        if (paramPaths.length > 0 && rest.length === 0) return { matched: true, pathTrace: [...paramPaths] };

        for (const paramPath of paramPaths) {
            const result = this.recursivePathMatch(rest, paramPath);
            if (result.matched) return { matched: true, pathTrace: [paramPath, ...result.pathTrace] };
        }

        return { matched: false, pathTrace: [] };
    }

    private static getPathnameChildrenOf(parent: Path | RouterCreator) {
        const pathnameKeys = Object.keys(parent);

        return pathnameKeys.map((key) => {
            if (parent instanceof Path) return (parent as any)[key] as Path;
            return (parent as any)[key] as Path;
        });
    }

    private static filterPathnamesWithParamNotation(paths: Path[]) {
        return paths.filter((p) => p.getPath().includes(":"));
    }
}
