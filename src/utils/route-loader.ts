import * as path from "path";
import { Logger } from "./logger";

/**
 * Loads and validates a route module (for development mode)
 * @param importPath - Path to import the module from
 * @param filePath - Original file path for logging
 * @param baseDir - Base directory for relative path calculation
 * @param logger - Logger instance
 * @returns Route handler function or null if invalid
 */
export function loadRouteModule(
  importPath: string,
  filePath: string,
  baseDir: string,
  logger: Logger
): ((app: any) => any) | null {
  try {
    const module = require(importPath);

    if (!module.default) {
      logger.warn(`Skipping ${path.relative(baseDir, filePath)} - no default export`);
      return null;
    }

    if (typeof module.default !== "function") {
      logger.warn(`Skipping ${path.relative(baseDir, filePath)} - default export is not a function`);
      return null;
    }

    return module.default;
  } catch (error) {
    logger.error(`Error loading ${path.relative(baseDir, filePath)}:`, error);
    return null;
  }
}
