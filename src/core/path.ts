import { RouterCreator } from "./router-creator";

export class Path {
    private path!: string;
    private paramValue: string | undefined;
    private isStoped: boolean | undefined;
    private parent!: Path | RouterCreator | null;
    private attributes!: string[];

    constructor(path: string, parent: Path | RouterCreator | null, attributes: string[] = []) {
        Object.defineProperty(this, "path", { value: path, enumerable: false });
        Object.defineProperty(this, "attributes", { value: attributes, enumerable: false });

        Object.defineProperty(this, "parent", { value: parent, enumerable: false, writable: true });
        Object.defineProperty(this, "paramValue", { value: undefined, enumerable: false, writable: true });
        Object.defineProperty(this, "isStoped", { value: undefined, enumerable: false, writable: true });

        Object.defineProperty(this, "_path", { value: undefined, enumerable: false, writable: true });
        Object.defineProperty(this, "_att", { value: undefined, enumerable: false, writable: true });
    }

    public getUrl(): string {
        if (this.parent instanceof RouterCreator) return Path.format(this.parent.getOrigin() + this.getPath());

        return Path.format((this.parent?.getUrl() ?? "") + this.getPath());
    }

    public start(): this {
        return this.clone({ isStoped: true });
    }

    public set(value: string): this {
        return this.clone({ paramValue: value });
    }

    public get(): string {
        if (this.isStoped) return "";

        if (this.parent instanceof RouterCreator) return this.getPath(true);
        return Path.format((this.parent?.get() ?? "") + this.getPath(true));
    }

    public has(attribute: string): boolean {
        return this.attributes.includes(attribute);
    }

    public getPath(resolveParams?: boolean): string {
        return "/" + (resolveParams && this.paramValue ? this.paramValue : this.path);
    }

    private static format(path: string): string {
        return path.replace(/\/$/, "");
    }

    private clone(args?: { isStoped?: boolean; paramValue?: string }, parent?: Path): this {
        const clone = new Path(this.path, parent ?? this.parent, this.attributes);
        clone.paramValue = args?.paramValue ?? this.paramValue;
        clone.isStoped = args?.isStoped ?? this.isStoped;

        Object.assign(clone, this);

        const childrenKeys = Object.keys(this);
        childrenKeys.forEach((key) => {
            (clone as any)[key] = ((this as any)[key] as Path).clone({}, clone);
        });

        return clone as this;
    }
}
