import * as fs from "fs";
import * as path from "path";

/**
 * Recursively scans a directory for all files
 * @param dir - Directory to scan
 * @returns Array of file paths
 */
export function scanFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }

  const queue = [dir];
  const files: string[] = [];

  while (queue.length > 0) {
    const currentDir = queue.pop()!;

    try {
      const entries = fs.readdirSync(currentDir);

      for (const entry of entries) {
        const fullPath = path.join(currentDir, entry);
        const stat = fs.statSync(fullPath);

        if (stat.isFile()) {
          files.push(fullPath);
        } else if (stat.isDirectory()) {
          queue.push(fullPath);
        }
      }
    } catch (error) {
      continue;
    }
  }

  return files;
}
