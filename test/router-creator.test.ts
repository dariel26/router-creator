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
        expect(routes.private.users.root.get()).toBe("/private/users");
        expect(routes.private.users.id_user.get()).toBe("/private/users/:id_user");
        expect(routes.private.lands.get()).toBe("/private/lands");
        expect(routes.private.lands.id_land.get()).toBe("/private/lands/:id_land");
        expect(routes.private.captures.root.get()).toBe("/private/captures");
        expect(routes.private.captures.id_capture.get()).toBe("/private/captures/:id_capture");
        expect(routes.private.captures.id_capture.upload.files.get()).toBe(
            "/private/captures/:id_capture/upload/files"
        );
        expect(routes.private.auth.signout.get()).toBe("/private/auth/sign-out");
        expect(routes.private.auth.session.get()).toBe("/private/auth/session");

        expect(routes.public.auth.signin.get()).toBe("/public/auth/sign-in");
        expect(routes.public.auth.signup.get()).toBe("/public/auth/sign-up");
        expect(routes.public.auth.forgot_password.get()).toBe("/public/auth/forgot-password");
    });

    it("Should return all correct stopped pathnames", () => {
        expect(routes.private.captures.id_capture.upload.start().files.get()).toBe("/files");
        expect(routes.private.captures.id_capture.start().upload.files.get()).toBe("/upload/files");
        expect(routes.private.captures.start().id_capture.upload.files.get()).toBe("/:id_capture/upload/files");
        expect(routes.private.start().captures.id_capture.upload.files.get()).toBe(
            "/captures/:id_capture/upload/files"
        );
        expect(routes.private.captures.id_capture.upload.files.get()).toBe(
            "/private/captures/:id_capture/upload/files"
        );
    });

    it("Should return all correct setted params", () => {
        expect(routes.private.captures.id_capture.set("34").upload.files.get()).toBe(
            "/private/captures/34/upload/files"
        );
        expect(routes.private.captures.id_capture.set("33").upload.files.get()).toBe(
            "/private/captures/33/upload/files"
        );
        expect(routes.private.captures.id_capture.set("35").upload.files.get()).toBe(
            "/private/captures/35/upload/files"
        );
        expect(routes.private.captures.id_capture.set("37").upload.files.get()).toBe(
            "/private/captures/37/upload/files"
        );
        expect(routes.private.captures.id_capture.upload.files.get()).toBe(
            "/private/captures/:id_capture/upload/files"
        );
    });

    it("Should return correctly fullUrl", () => {
        expect(routes.private.users.root.getUrl()).toBe(ORIGIN + "/private/users");
    });

    it("Should match all pathnames", () => {
        const pathname1 = "/private/users/321";
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

    it("Should not create malconfigured paths", () => {
        const malConfiguredRoute = new RouterCreator("").createPathnames({ mal_formed: 123 as unknown as string });
        expect(malConfiguredRoute.mal_formed?.get()).toBe(undefined);
    });
});
