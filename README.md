# Elysia Router

File-based routing for [Elysia](https://elysiajs.com). Create files, get routes.

## Install

```bash
bun add elysia-router
```

## Use

```typescript
import { Elysia } from "elysia";
import { router } from "elysia-router";

const app = new Elysia().use(router()).listen(3000);
```

Create route files:

```typescript
// routes/index.ts
export default (app: Elysia) => app.get("/", () => "Hello World!");

// routes/users/[id].ts
export default (app: Elysia) => app.get("/", ({ params }) => `User: ${params.id}`);
```

## One file per endpoint

Use `[param]` for dynamic routes and `(name)` for static routes in dynamic folders. The HTTP method is read from the function in the file.

One file per endpoint, like so:

```
routes/users/
├── index.ts     → GET /users
├── create.ts    → POST /users
├── [id].ts      → GET /users/:id
└── [id]/
    ├── update.ts → PUT /users/:id
    └── delete.ts → DELETE /users/:id
```

## Options

```typescript
router({
  directory: "api", // default: "routes"
  debug: true, // default: false
});
```

## Production

For compiled production builds, generate an import map before compiling

```typescript
import { generateImportMap } from "elysia-router";
generateImportMap({ directory: "routes" });
```

Or use the bun plugin

```typescript
import { buildPlugin } from "elysia-router";

await Bun.build({
  entrypoints: ["src/index.ts"],
  target: "bun",
  outdir: "out",
  minify: true,
  compile: true,
  plugins: [
    buildPlugin({
      directory: "src/routes",
      debug: false,
    }),
  ],
});
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
