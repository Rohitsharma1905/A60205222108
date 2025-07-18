export async function Log(stack, level, pkg, message, token) {
  const allowedStacks = ["frontend", "backend"];
  const allowedLevels = ["debug", "info", "warn", "error", "fatal"];
  const frontendPackages = ["api", "component", "hook", "page", "state", "style"];
  const sharedPackages = ["auth", "config", "middleware", "utils"];
  const allowedPackages = [...frontendPackages, ...sharedPackages];

  if (!allowedStacks.includes(stack)) throw new Error("Invalid stack");
  if (!allowedLevels.includes(level)) throw new Error("Invalid level");
  if (!allowedPackages.includes(pkg)) throw new Error("Invalid package");

  const response = await fetch('http://20.244.56.144/evaluation-service/logs', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({
      stack,
      level,
      package: pkg,
      message
    })
  });

  if (!response.ok) throw new Error("Log failed");
  return response.json();
}
