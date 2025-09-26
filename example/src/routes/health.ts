import type { App } from "../index";

export default (app: App) =>
  app.get("", async () => {
    return "OK";
  });
