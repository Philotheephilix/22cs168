import dotenv from "dotenv";

dotenv.config();
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

export default async function log(
  stack: Stack,
  level: Level,
  package_name: Package,
  message: string
): Promise<{ logId: string,message:string } | void> {
  try {
    const response = await fetch("http://20.244.56.144/evaluation-service/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.ACCESS_TOKEN}`,
      },
      body: JSON.stringify({
        stack,
        level,
        package: package_name,
        message,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging:", error);
  }
}
