import type { BunPlugin } from "bun";
import { generateImportMap } from "./generator";
import { RouterOptions } from "./types";

/**
 * Bun plugin that automatically generates the import map before building
 * @param options - Router configuration options
 * @returns Bun plugin configuration
 */
export function buildPlugin(options: RouterOptions = {}): BunPlugin {
  return {
    name: "elysia-router",
    setup(build) {
      build.onStart(async () => {
        console.log("🔄 Generating route import map...");
        try {
          generateImportMap(options);
          console.log("✅ Route import map generated successfully");
        } catch (error) {
          console.error("❌ Failed to generate route import map:", error);
          throw error;
        }
      });
    },
  };
}
