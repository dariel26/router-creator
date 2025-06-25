import { RouterCreator } from "./router-creator";

export class Path {
    private path!: string;
    private paramValue: string | undefined;
    private parent!: Path | RouterCreator | null;
    private attributes!: string[];

    constructor(path: string, parent: Path | RouterCreator | null, attributes: string[] = []) {
        Object.defineProperty(this, "path", { value: path, enumerable: false });
        Object.defineProperty(this, "parent", { value: parent, enumerable: false });
        Object.defineProperty(this, "attributes", {
            value: attributes,
            enumerable: false,
        });
        Object.defineProperty(this, "paramValue", {
            value: undefined,
            enumerable: false,
            writable: true,
        });
        Object.defineProperty(this, "_path", {
            value: undefined,
            enumerable: false,
            writable: true,
        });
        Object.defineProperty(this, "_att", {
            value: undefined,
            enumerable: false,
            writable: true,
        });
    }

    public getFullPath(opt?: { maxParents?: number; resolveParams?: boolean }): string {
        const maxParents = opt?.maxParents === undefined ? -1 : opt.maxParents;

        if (this.parent instanceof RouterCreator) return this.getPath();

        switch (maxParents) {
            case -1:
                return Path.format((this.parent?.getFullPath(opt) ?? "") + this.getPath(opt?.resolveParams));
            case 0:
                return this.getPath(opt?.resolveParams);
            default:
                return Path.format(
                    (this.parent?.getFullPath({ ...opt, maxParents: maxParents - 1 }) ?? "") +
                        this.getPath(opt?.resolveParams)
                );
        }
    }

    public getFullUrl(): string {
        if (this.parent instanceof RouterCreator) return Path.format(this.parent.getOrigin() + this.getPath());

        return Path.format((this.parent?.getFullUrl() ?? "") + this.getPath());
    }

    public setParam(value: string): this {
        this.paramValue = value;
        return this;
    }

    public has(attribute: string): boolean {
        return this.attributes.includes(attribute);
    }

    private getPath(resolveParams?: boolean): string {
        return "/" + (resolveParams && this.paramValue ? this.paramValue : this.path);
    }

    private static format(path: string): string {
        return path.replace(/\/$/, "");
    }
}
