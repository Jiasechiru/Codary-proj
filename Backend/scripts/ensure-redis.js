require("dotenv").config();

const net = require("node:net");
const { spawnSync } = require("node:child_process");

const CONTAINER_NAME = "codary-redis";
const REDIS_IMAGE = "redis:7-alpine";
const DEFAULT_REDIS_URL = "redis://localhost:6379";

function run(command, args) {
  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio: "pipe",
  });

  if (result.error) {
    throw result.error;
  }

  return result;
}

function parseRedisUrl(redisUrl) {
  const url = new URL(redisUrl || DEFAULT_REDIS_URL);
  return {
    host: url.hostname || "localhost",
    port: Number(url.port || 6379),
  };
}

function isLocalHost(host) {
  return host === "localhost" || host === "127.0.0.1" || host === "::1";
}

function canConnect(host, port, timeoutMs = 1000) {
  return new Promise((resolve) => {
    const socket = net.createConnection({ host, port });

    const finish = (ok) => {
      socket.destroy();
      resolve(ok);
    };

    socket.setTimeout(timeoutMs);
    socket.once("connect", () => finish(true));
    socket.once("timeout", () => finish(false));
    socket.once("error", () => finish(false));
  });
}

function ensureDockerDaemon() {
  const dockerCheck = run("docker", ["info"]);
  if (dockerCheck.status !== 0) {
    const details = (dockerCheck.stderr || dockerCheck.stdout || "").trim();
    throw new Error(
      `Docker daemon is not available.\n${details}\n\nStart Docker and rerun: npm run dev`
    );
  }
}

function containerExists() {
  const inspect = run("docker", ["ps", "-a", "--filter", `name=^/${CONTAINER_NAME}$`, "--format", "{{.Names}}"]);
  return inspect.stdout.trim() === CONTAINER_NAME;
}

function containerIsRunning() {
  const inspect = run("docker", ["ps", "--filter", `name=^/${CONTAINER_NAME}$`, "--format", "{{.Names}}"]);
  return inspect.stdout.trim() === CONTAINER_NAME;
}

function startRedisContainer(port) {
  if (containerIsRunning()) {
    // eslint-disable-next-line no-console
    console.log(`[redis] container already running: ${CONTAINER_NAME}`);
    return;
  }

  if (containerExists()) {
    // eslint-disable-next-line no-console
    console.log(`[redis] starting existing container: ${CONTAINER_NAME}`);
    const start = run("docker", ["start", CONTAINER_NAME]);
    if (start.status !== 0) {
      throw new Error(`Failed to start container ${CONTAINER_NAME}: ${start.stderr || start.stdout}`);
    }
    return;
  }

  // eslint-disable-next-line no-console
  console.log(`[redis] creating container: ${CONTAINER_NAME}`);
  const create = run("docker", [
    "run",
    "-d",
    "--name",
    CONTAINER_NAME,
    "-p",
    `${port}:6379`,
    REDIS_IMAGE,
  ]);

  if (create.status !== 0) {
    throw new Error(`Failed to create Redis container: ${create.stderr || create.stdout}`);
  }
}

async function waitForRedis(host, port, attempts = 30, delayMs = 500) {
  for (let i = 0; i < attempts; i += 1) {
    // eslint-disable-next-line no-await-in-loop
    if (await canConnect(host, port)) {
      return;
    }
    // eslint-disable-next-line no-await-in-loop
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  throw new Error(`Redis is not reachable at ${host}:${port} after startup`);
}

async function main() {
  const { host, port } = parseRedisUrl(process.env.REDIS_URL);

  if (await canConnect(host, port)) {
    // eslint-disable-next-line no-console
    console.log(`[redis] already running at ${host}:${port}`);
    return;
  }

  if (!isLocalHost(host)) {
    throw new Error(
      `Redis is not reachable at ${host}:${port}.\n` +
        `REDIS_URL points to a remote host — start Redis there manually or change REDIS_URL.`
    );
  }

  ensureDockerDaemon();
  startRedisContainer(port);
  await waitForRedis(host, port);

  // eslint-disable-next-line no-console
  console.log(`[redis] ready at ${host}:${port}`);
}

main().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(`[redis] ${error.message}`);
  process.exit(1);
});
