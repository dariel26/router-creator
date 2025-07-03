# Router Creator [![codecov](https://codecov.io/gh/dariel26/router-creator/branch/main/graph/badge.svg?token=Y6XK7MPEJU)](https://codecov.io/gh/dariel26/router-creator)

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
            idUser: ":id_user",
        },
        auth: {
            signout: "sign-out",
            session: {},
        },
    },
    public: {
        auth: {
            signin: "sign-in",
            signup: {
                _path: "sign-up",
                init: {},
                complete: {},
            },
        },
    },
});

// Accessing full path
routes.private.users.root.get(); // "/private/users"
routes.private.users.idUser.get(); // "/private/users/:id_user"
routes.private.users.idUser.set("123").get(); // "/private/users/123"

//Accessing full URL
routes.private.auth.signout.getUrl(); // "http://localhost:3000/private/auth/sign-out"

// Matching pathnames
routes.hasPathname("/private/users"); // true
routes.hasPathname("/private/users/123"); // true
routes.hasPathname("/private/invalid"); // false

// Match path with specific attribute (e.g. "loggable")
routes.hasPathname("/private/users/123", { attribute: "loggable" }); // true
routes.hasPathname("/private/auth/sign-out", { attribute: "loggable" }); // false
```

---

## 📚 API Overview

### `Defining Your Route Tree with createPathnames()`

The `createPathnames()` method accepts a plain object that represents your entire route structure. Each key becomes a named path, and you can define dynamic segments, nested paths, and attach custom attributes to each route.

---

#### 🔑 Object Syntax

Each key inside the object represents a route segment. You can define:

-   A static path: `""` or `"segment"` that will be converted into `"/"` or `"/segment"` respectively.
-   A dynamic parameter: `":paramName"` that will be converted into `"/:paramName"`.
-   Nested objects for nested paths. The key of the object will be used as the path segment if isn't a `_path` key inside the object.
-   Metadata using special keys:
    -   `_path`: defines the current segment (when isn't defined, the key of the object will be used).
    -   `_att`: an array of custom attributes (optional)

---

#### 💡 Example

```ts
const routes = new RouterCreator("https://example.com").createPathnames({
    private: {
        // means "/private"
        users: {
            // means "/users"
            idUser: ":idUser", // means "/:idUser"
        },
        reports: {
            // means "/reports"
            id_report: {
                _path: ":id_report", // means "/:id_report"
                _att: ["loggable"],
                download: {
                    // means "/download"
                    file: {}, // means "/file"
                },
            },
        },
    },
});
```

---

### `new RouterCreator(origin: string)`

Creates a new router with a defined base origin (e.g. `"https://myapp.com"`).

---

### `Path.get()`

Returns the full pathname from the root to this path.

```ts
routes.private.users.idUser.get(); // "/private/users/:id_user"
```

---

### `Path.getPath()`

Returns the pathname of the current path.

```ts
routes.private.users.idUser.getPath(); // "/:id_user"
```

---

### `Path.getUrl()`

Returns the full URL including origin.

```ts
routes.private.users.idUser.getUrl();
// "http://localhost:3000/private/users/:id_user"
```

---

### `Path.set(value: string)`

Injects a parameter into a route that uses a :param placeholder.

```ts
routes.private.users.id_user.set("abc123").get(); // "/private/users/abc123"
routes.private.users.id_user.get(); // "/private/users/id-user"
```

---

### `Path.start()`

Starts the pathname in the next child path.

```ts
routes.private.start().users.id_user.get(); // "/users/:id-user"
routes.private.users.start().id_user.get(); // "/:id-user"
```

### `router.hasPathname(pathname: string, options?: { attribute?: string })`

Checks if the given pathname exists in the route tree. Optionally filters by attribute.

```ts
routes.hasPathname("/private/users/abc123"); // boolean
routes.hasPathname("/private/captures/123/upload/files", { attribute: "loggable" }); // boolean
```
