import Elysia from "elysia";
import { router } from "elysia-router";

const app = new Elysia();

app.use(
  router({
    directory: "src/routes",
    debug: true,
  })
);

app.listen(3000, () => console.log("Server running at http://localhost:3000"));

export type App = typeof app;
