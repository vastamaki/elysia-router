/**
 * Logger utility that respects debug flag
 */
export class Logger {
  constructor(private debug: boolean = false) {}

  info(message: string, ...args: any[]) {
    if (this.debug) {
      console.log(`[fs-router] ${message}`, ...args);
    }
  }

  warn(message: string, ...args: any[]) {
    if (this.debug) {
      console.warn(`[fs-router] ${message}`, ...args);
    }
  }

  error(message: string, ...args: any[]) {
    if (this.debug) {
      console.error(`[fs-router] ${message}`, ...args);
    }
  }
}
