type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private static log(level: LogLevel, message: string, variable?: any): void {
    const env = import.meta.env.VITE_MODE || "undefined";

    if (env !== "development") {
      return;
    }

    const logMessage =
      variable !== undefined
        ? `${message}: ${JSON.stringify(variable)}`
        : message;

    switch (level) {
      case "info":
        console.info(`INFO: ${logMessage}`);
        break;
      case "warn":
        console.warn(`WARN: ${logMessage}`);
        break;
      case "error":
        console.error(`ERROR: ${logMessage}`);
        break;
      case "debug":
        console.debug(`DEBUG: ${logMessage}`);
        break;
    }
  }

  static info(message: string, variable?: any): void {
    Logger.log("info", message, variable);
  }

  static warn(message: string, variable?: any): void {
    Logger.log("warn", message, variable);
  }

  static error(message: string, variable?: any): void {
    Logger.log("error", message, variable);
  }

  static debug(message: string, variable?: any): void {
    Logger.log("debug", message, variable);
  }
}

export default Logger;
