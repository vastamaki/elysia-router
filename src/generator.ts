import * as fs from "fs";
import * as path from "path";
import { RouterOptions } from "./types";
import { Logger, scanFiles, createRoutePath } from "./utils";
import { fileURLToPath } from "bun";

/**
 * Generates the internal routes.ts file with static imports for build-time compilation
 * @param options - Configuration options
 */
export function generateImportMap(options: RouterOptions = {}): void {
  const directory = options.directory ?? "routes";
  const debug = options.debug ?? false;
  const logger = new Logger(debug);
  const baseDir = path.join(process.cwd(), directory);
  const __dirname = path.dirname(fileURLToPath(import.meta.url));

  const routesFilePath = path.join(__dirname, "routes.js");

  if (!fs.existsSync(baseDir)) {
    logger.warn(`Routes directory ${baseDir} does not exist. Skipping import map generation.`);
    return;
  }

  const files = scanFiles(baseDir);
  const imports: string[] = [];
  const routeMapEntries: string[] = [];

  let importIndex = 0;
  for (const filePath of files) {
    // Skip non-TypeScript/JavaScript files
    if (!/\.(ts|js|tsx|jsx)$/.test(filePath)) {
      continue;
    }

    const routePath = createRoutePath(filePath, baseDir);
    const relativePath = path.relative(process.cwd(), filePath);
    const importName = `route${importIndex++}`;

    const pluginSrcDir = __dirname;
    const relativeFromPlugin = path.relative(pluginSrcDir, filePath);

    imports.push(`import ${importName} from "${relativeFromPlugin.replace(/\\/g, "/")}";`);
    routeMapEntries.push(`  "${routePath}": { handler: ${importName}, filePath: "${relativePath}" }`);
  }

  const content = `// Auto-generated route map for fs-router
// This file is updated by generateImportMap()

${imports.join("\n")}

export const routeMap = {
${routeMapEntries.join(",\n")}
};
`;

  try {
    fs.writeFileSync(routesFilePath, content);
    logger.info(`Generated internal route map with ${files.length} routes`);
  } catch (error) {
    logger.error("Failed to write routes file:", error);
    throw error;
  }
}
