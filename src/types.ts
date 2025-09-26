export interface RouterOptions {
  /**
   * The directory to scan for route files
   * @default "routes"
   */
  directory?: string;
  /**
   * Enable debug logging
   * @default false
   */
  debug?: boolean;
}

export interface LoadedRoute {
  routePath: string;
  handler: (app: any) => any;
  filePath: string;
}
