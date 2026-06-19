const { spawnSync } = require("node:child_process");
const path = require("node:path");

const ROOT_DIR = path.resolve(__dirname, "..");
const FORCE_BUILD = process.argv.includes("--force");

const IMAGES = [
  {
    name: "codary-runner-js",
    contextDir: "docker/javascript",
  },
  {
    name: "codary-runner-c",
    contextDir: "docker/c",
  },
];

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: ROOT_DIR,
    encoding: "utf8",
    stdio: "pipe",
    ...options,
  });

  if (result.error) {
    throw result.error;
  }

  return result;
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

function imageExists(imageName) {
  const inspect = run("docker", ["image", "inspect", imageName]);
  return inspect.status === 0;
}

function buildImage(image) {
  const contextPath = path.join(ROOT_DIR, image.contextDir);
  const build = run("docker", ["build", "-t", image.name, contextPath], { stdio: "inherit" });
  if (build.status !== 0) {
    throw new Error(`Failed to build Docker image: ${image.name}`);
  }
}

function main() {
  ensureDockerDaemon();

  for (const image of IMAGES) {
    if (!FORCE_BUILD && imageExists(image.name)) {
      // eslint-disable-next-line no-console
      console.log(`[docker] image exists: ${image.name}`);
      continue;
    }

    // eslint-disable-next-line no-console
    console.log(`[docker] building: ${image.name}`);
    buildImage(image);
  }
}

try {
  main();
} catch (error) {
  // eslint-disable-next-line no-console
  console.error(`[docker] ${error.message}`);
  process.exit(1);
}
