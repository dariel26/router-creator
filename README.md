# Router Creator

**router-creator** is a lightweight TypeScript utility for building full route trees with support for pathnames, nested segments, parameters, attributes, and origins.

It simplifies dynamic URL construction and routing logic in frontend or backend projects, offering utilities to set parameters, resolve full paths or URLs, and even validate if a pathname exists in your route tree.

---

## ✨ Features

-   🌳 Build nested and typed route trees
-   🌐 Handle full paths and origins
-   ⚙️ Support for dynamic parameters (e.g. `:id`)
-   🔍 Match pathnames and validate against route tree
-   🏷️ Add attributes to paths (e.g. `loggable`, `authRequired`, etc.)
-   🧪 Fully tested and TypeScript-ready

---

## 📦 Installation

```bash
npm install router-creator

# or

yarn add router-creator
```

---

## 🚀 Getting Started

```ts
import { RouterCreator } from "router-creator";

const routes = new RouterCreator("http://localhost:3000").createPathnames({
    private: {
        users: {
            _att: ["loggable"],
            root: "",
            idUser: { _path: ":id_user" },
        },
        auth: {
            signout: { _path: "sign-out" },
        },
    },
    public: {
        auth: {
            signin: { _path: "sign-in" },
        },
    },
});

// Accessing full path and full url
routes.private.users.root.getFullPath(); // "/private/users"
routes.private.users.idUser.getFullPath(); // "/private/users/:id_user"

routes.private.users.idUser.setParam("123").getFullPath({ resolveParams: true });
// "/private/users/123"

routes.private.auth.signout.getFullUrl();
// "http://localhost:3000/private/auth/sign-out"

// Matching pathnames
routes.hasPathname("/private/users"); // true
routes.hasPathname("/private/users/123"); // true
routes.hasPathname("/private/invalid"); // false

// Match path with specific attribute (e.g. "loggable")
routes.hasPathname("/private/users/123", { attribute: "loggable" }); // true
routes.hasPathname("/private/auth/sign-out", { attribute: "loggable" }); // false
```

## 📚 API Overview

### `new RouterCreator(origin: string)`

Creates a new router with a defined base origin (e.g. `"https://myapp.com"`).

---

### `.createPathnames(obj: PathObject)`

Builds and returns a typed object structure with Path instances.

---

### `Path.getFullPath(options?: { maxParents?: number; resolveParams?: boolean })`

Returns the full pathname from the root to this path.

#### Options:

-   `maxParents`: limit how many parents to include in the returned path.
-   `resolveParams`: replaces param tokens (like :id_user) with real values. The `_path` should be defined like `:anything`.

---

### `Path.getFullUrl()`

Returns the full URL including origin.

```ts
routes.private.users.idUser.getFullUrl();
// "http://localhost:3000/private/users/:id_user"
```

---

### `Path.setParam(value: string)`

Injects a parameter into a route that uses a :param placeholder.

```ts
const userPath = routes.private.users.id_user.setParam("abc123");
userPath.getFullPath({ resolveParams: true }); // "/private/users/abc123"
```

### `router.hasPathname(pathname: string, options?: { attribute?: string })`

Checks if the given pathname exists in the route tree. Optionally filters by attribute.

```ts
routes.hasPathname("/private/users/abc123"); // true or false
routes.hasPathname("/private/captures/123/upload/files", { attribute: "loggable" }); // true or false
```

---

## 🧱 Defining Your Route Tree with `createPathnames()`

The `createPathnames()` method accepts a plain object that represents your entire route structure. Each key becomes a named path, and you can define dynamic segments, nested paths, and attach custom attributes to each route.

---

### 🔑 Object Syntax

Each key inside the object represents a route segment. You can define:

-   A static path: `""` or `"segment"` that will be converted into `"/"` or `"/segment"` respectively.
-   A dynamic parameter: `":paramName"` that will be converted into `"/:paramName"`.
-   Nested objects for nested paths. The key of the object will be used as the path segment if isn't a `_path` key inside the object.
-   Metadata using special keys:
    -   `_path`: defines the current segment (when isn't defined, the key of the object will be used).
    -   `_att`: an array of custom attributes (optional)

---

### 💡 Example

```ts
const routes = new RouterCreator("https://example.com").createPathnames({
    private: {
        // converted into "/private"
        users: {
            // converted into "/users"
            root: "", // converted into "/"
            idUser: { _path: ":id_user" }, // converted into "/:id_user"
        },
        reports: {
            // converted into "/reports"
            root: "", // converted into "/"
            id_report: {
                _path: ":id_report", // converted into "/:id_report"
                _att: ["loggable"],
                download: {
                    // converted into "/download"
                    file: null, // converted into "/file"
                },
            },
        },
    },
});
```
