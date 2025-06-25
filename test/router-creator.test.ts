import RouterCreator from "../src";

describe("Route Builder", () => {
    const ORIGIN = "http://localhost:3000";
    const COMMOM_ATTRIBUTES = ["loggable"];

    const routes = new RouterCreator(ORIGIN).createPathnames({
        private: {
            users: {
                root: "",
                id_user: { _path: ":id_user" },
            },
            lands: {
                root: "",
                id_land: { _path: ":id_land" },
            },
            captures: {
                root: "",
                id_capture: { _path: ":id_capture", _att: COMMOM_ATTRIBUTES, upload: { files: null } },
            },
            example: {
                id_example: { _path: ":id_example", id_other: { _path: ":id_other", final: null } },
            },
            auth: {
                signout: { _path: "sign-out" },
                session: null,
            },
        },
        public: {
            auth: {
                signin: { _path: "sign-in" },
                signup: { _path: "sign-up" },
                forgot_password: { _path: "forgot-password" },
            },
        },
    });

    it("Should return all correct fullPath", () => {
        expect(routes.private.users.root.getFullPath()).toBe("/private/users");
        expect(routes.private.users.id_user.getFullPath()).toBe("/private/users/:id_user");
        expect(routes.private.lands.getFullPath()).toBe("/private/lands");
        expect(routes.private.lands.id_land.getFullPath()).toBe("/private/lands/:id_land");
        expect(routes.private.captures.root.getFullPath()).toBe("/private/captures");
        expect(routes.private.captures.id_capture.getFullPath()).toBe("/private/captures/:id_capture");
        expect(routes.private.captures.id_capture.upload.files.getFullPath()).toBe(
            "/private/captures/:id_capture/upload/files"
        );
        expect(routes.private.auth.signout.getFullPath()).toBe("/private/auth/sign-out");
        expect(routes.private.auth.session.getFullPath()).toBe("/private/auth/session");

        expect(routes.public.auth.signin.getFullPath()).toBe("/public/auth/sign-in");
        expect(routes.public.auth.signup.getFullPath()).toBe("/public/auth/sign-up");
        expect(routes.public.auth.forgot_password.getFullPath()).toBe("/public/auth/forgot-password");
    });

    it("Should return correctly fullUrl", () => {
        expect(routes.private.users.root.getFullUrl()).toBe(ORIGIN + "/private/users");
    });

    it("Should return all correct fullPath with maxParents === 1", () => {
        expect(routes.private.users.root.getFullPath({ maxParents: 1 })).toBe("/users");
        expect(routes.private.users.id_user.getFullPath({ maxParents: 1 })).toBe("/users/:id_user");
        expect(routes.private.lands.getFullPath({ maxParents: 1 })).toBe("/private/lands");
        expect(routes.private.lands.id_land.getFullPath({ maxParents: 1 })).toBe("/lands/:id_land");
        expect(routes.private.captures.root.getFullPath({ maxParents: 1 })).toBe("/captures");
        expect(routes.private.captures.id_capture.getFullPath({ maxParents: 1 })).toBe("/captures/:id_capture");
        expect(routes.private.captures.id_capture.upload.files.getFullPath({ maxParents: 1 })).toBe("/upload/files");
        expect(routes.private.auth.signout.getFullPath({ maxParents: 1 })).toBe("/auth/sign-out");
        expect(routes.private.auth.session.getFullPath({ maxParents: 1 })).toBe("/auth/session");

        expect(routes.public.auth.signin.getFullPath({ maxParents: 1 })).toBe("/auth/sign-in");
        expect(routes.public.auth.signup.getFullPath({ maxParents: 1 })).toBe("/auth/sign-up");
        expect(routes.public.auth.forgot_password.getFullPath({ maxParents: 1 })).toBe("/auth/forgot-password");
    });

    it("Should return all correct fullPath with maxParents === 0", () => {
        expect(routes.private.users.root.getFullPath({ maxParents: 0 })).toBe("/");
        expect(routes.private.users.id_user.getFullPath({ maxParents: 0 })).toBe("/:id_user");
        expect(routes.private.lands.getFullPath({ maxParents: 0 })).toBe("/lands");
        expect(routes.private.lands.id_land.getFullPath({ maxParents: 0 })).toBe("/:id_land");
        expect(routes.private.captures.root.getFullPath({ maxParents: 0 })).toBe("/");
        expect(routes.private.captures.id_capture.getFullPath({ maxParents: 0 })).toBe("/:id_capture");
        expect(routes.private.captures.id_capture.upload.files.getFullPath({ maxParents: 0 })).toBe("/files");
        expect(routes.private.auth.signout.getFullPath({ maxParents: 0 })).toBe("/sign-out");
        expect(routes.private.auth.session.getFullPath({ maxParents: 0 })).toBe("/session");

        expect(routes.public.auth.signin.getFullPath({ maxParents: 0 })).toBe("/sign-in");
        expect(routes.public.auth.signup.getFullPath({ maxParents: 0 })).toBe("/sign-up");
        expect(routes.public.auth.forgot_password.getFullPath({ maxParents: 0 })).toBe("/forgot-password");
    });

    it("Should return all correct fullPath with and without real params", () => {
        const routeLand = routes.private.lands.id_land.setParam("123");

        expect(routeLand.getFullPath({ resolveParams: true })).toBe("/private/lands/123");
        expect(routeLand.getFullPath()).toBe("/private/lands/:id_land");

        const routeCaptureUploadFiles = routes.private.captures.id_capture.setParam("123").upload.files;

        expect(routeCaptureUploadFiles.getFullPath({ resolveParams: true })).toBe("/private/captures/123/upload/files");
        expect(routeCaptureUploadFiles.getFullPath()).toBe("/private/captures/:id_capture/upload/files");
    });

    it("Should match all pathnames", () => {
        const pathname1 = "/private/users";
        const pathname2 = "/private/captures/123/upload/files";
        const pathname3 = "/private/example/123/321/final";

        expect(routes.hasPathname(pathname1)).toBe(true);
        expect(routes.hasPathname(pathname2)).toBe(true);
        expect(routes.hasPathname(pathname3)).toBe(true);
    });

    it("Should match pathnames with attributes", () => {
        const pathname = "/private/captures/123/upload/files";

        expect(routes.hasPathname(pathname, { attribute: COMMOM_ATTRIBUTES[0] })).toBe(true);
    });

    it("Should dont match pathnames with not corresponding attributes", () => {
        const pathname = "/private/captures/123/upload/files";

        expect(routes.hasPathname(pathname, { attribute: "loggabl" })).toBe(false);
    });

    it("Should dont match pathnames with not corresponding path", () => {
        const pathname1 = "/private/captures/123/upload/files/unexist";
        const pathname2 = "/private/example/123/321/unexist";

        expect(routes.hasPathname(pathname1)).toBe(false);
        expect(routes.hasPathname(pathname2)).toBe(false);
    });
});
