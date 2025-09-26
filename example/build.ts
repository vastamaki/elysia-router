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
