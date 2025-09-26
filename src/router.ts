import * as fs from "fs";
import * as path from "path";
import { Elysia } from "elysia";

import { RouterOptions, LoadedRoute } from "./types";
import { createRoutePath, loadRouteModule, Logger, scanFiles } from "./utils";
import { routeMap } from "./routes";

/**
 * Creates a filesystem-based router for Elysia
 *
 * This plugin automatically discovers route files in your filesystem and registers them
 * with Elysia. It supports both development mode (dynamic loading) and production mode
 * (static imports for better performance).
 *
 * @param options - Configuration options
 * @returns Elysia plugin function
 */
export function router(options: RouterOptions = {}) {
  const directory = options.directory ?? "routes";
  const debug = options.debug ?? false;
  const logger = new Logger(debug);
  const baseDir = path.join(process.cwd(), directory);
  const isDevelopment = process.env.NODE_ENV !== "production";

  const routes: LoadedRoute[] = [];

  if (isDevelopment && fs.existsSync(baseDir)) {
    logger.info("Using dynamic route loading (development mode)");

    const files = scanFiles(baseDir);

    for (const filePath of files) {
      if (!/\.(ts|js|tsx|jsx)$/.test(filePath)) {
        continue;
      }

      const routePath = createRoutePath(filePath, baseDir);
      const importPath = path.resolve(filePath);

      const routeHandler = loadRouteModule(importPath, filePath, baseDir, logger);
      if (!routeHandler) continue;

      routes.push({
        routePath,
        handler: routeHandler,
        filePath: path.relative(process.cwd(), filePath),
      });

      logger.info(`Loaded ${path.relative(baseDir, filePath)} at ${routePath} (dynamic)`);
    }
  }

  for (const [routePath, routeInfo] of Object.entries(routeMap)) {
    const handler = routeInfo.handler?.default || routeInfo.handler;

    if (typeof handler !== "function") {
      logger.warn(`Skipping ${routeInfo.filePath} - invalid handler`);
      continue;
    }

    routes.push({
      routePath,
      handler,
      filePath: routeInfo.filePath,
    });

    logger.info(`Loaded ${routeInfo.filePath} at ${routePath}`);
  }

  logger.info(`Registered ${routes.length} routes`);

  return (app: Elysia) => {
    for (const route of routes) {
      try {
        app.group(route.routePath, (groupApp) => {
          return route.handler(groupApp) || groupApp;
        });
      } catch (error) {
        logger.error(`Failed to register route ${route.routePath}:`, error);
      }
    }

    return app;
  };
}
