export {};

declare global {
  type Stack = "backend" | "frontend";

  type Level = "debug" | "info" | "warn" | "error" | "fatal";

  type BackendPackage =
    | "cache"
    | "controller"
    | "cron_job"
    | "db"
    | "domain"
    | "handler"
    | "repository"
    | "route"
    | "service";

  type FrontendPackage =
    | "api"
    | "component"
    | "hook"
    | "page"
    | "state"
    | "style";

  type SharedPackage =
    | "auth"
    | "config"
    | "middleware"
    | "utils";

  type Package = BackendPackage | FrontendPackage | SharedPackage;

  interface LogEntry {
    stack: Stack;
    level: Level;
    package: Package;
    message: string;
    timestamp: string;
  }
}
