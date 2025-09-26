import { t } from "elysia";
import type { App } from "../../index";

export default (app: App) =>
  app.post(
    "",
    async ({ body }) => {
      return body;
    },
    {
      body: t.Object({
        name: t.String(),
        age: t.Number(),
      }),
    }
  );
