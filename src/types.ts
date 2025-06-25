import { Path } from "./core/path";

export type PathObject = {
    _path?: string;
    _att?: string[];
    [k: string]: PathObject | string | string[] | null | undefined;
};

export type PathObjectResult<Obj extends PathObject> = {
    [K in keyof Obj]: Obj[K] extends PathObject
        ? Path & PathObjectResult<Omit<Obj[K], "_path" | "_att">>
        : Obj[K] extends string | null
        ? Path
        : never;
};
