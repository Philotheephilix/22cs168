export default async function log(
  stack: Stack,
  level: Level,
  package_name: Package,
  message: string
): Promise<{ logId: string,message:string } | void> {
  try {
    const response = await fetch("http://127.0.0.1:3001/log", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        stack,
        level,
        package_name: package_name,
        message,
      }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error logging:", error);
  }
}
