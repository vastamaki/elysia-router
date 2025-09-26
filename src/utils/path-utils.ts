import * as path from "path";

/**
 * Converts file path to route path following filesystem routing conventions
 * @param filePath - Full file path
 * @param baseDir - Base directory for routes
 * @returns Normalized route path
 */
export function createRoutePath(filePath: string, baseDir: string): string {
  let routePath = path.relative(baseDir, filePath.replace(/\.[^.]*$/, ""));

  // Handle parentheses in filename - remove the filename if it contains parentheses
  const filename = path.basename(routePath);
  if (/\([^)]+\)/.test(filename)) {
    const dirPath = path.dirname(routePath);
    routePath = dirPath === "." ? "" : dirPath;
  }

  // Convert NextJS-style parameters [param] to Express-style :param
  const parameterizedPath = routePath.replace(/\[([^\]]+)\]/g, ":$1");

  // Normalize path separators and ensure leading slash
  return ("/" + parameterizedPath).replace(/\\/g, "/").replace(/\/+/g, "/");
}
