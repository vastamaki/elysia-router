import dts from "bun-plugin-dts";

await Bun.build({
  entrypoints: ["src/index.ts"],
  target: "bun",
  outdir: "dist",
  minify: false,
  plugins: [
    dts(),
    {
      name: "external-routes",
      setup(build) {
        build.onResolve({ filter: /(src\/routes|\.\/routes|routes)(\.ts)?$/ }, () => {
          return {
            path: "./routes",
            external: true,
          };
        });
      },
    },
  ],
  define: {
    "process.env.NODE_ENV": "process.env.NODE_ENV",
  },
});

await Bun.build({
  entrypoints: ["src/routes.ts"],
  target: "bun",
  outdir: "dist",
  minify: false,
  plugins: [dts()],
});
