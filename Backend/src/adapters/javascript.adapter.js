const path = require("path");
const fs = require("fs/promises");

const IMAGE = "codary-runner-js";
const TIMEOUT_MS = 3000;

/**
 * Builds a self-contained JS script that:
 * 1. Defines the user's solution (their code).
 * 2. Runs each test case and prints PASS/FAIL lines.
 */
function buildTestScript(userCode, codeTests) {
  const cases = codeTests
    .map((t) => {
      const inputLiteral = JSON.stringify(t.input);
      const expectedLiteral = JSON.stringify(t.expectedOutput.trim());
      return (
        `(() => {\n` +
        `  const input = ${inputLiteral};\n` +
        `  const expected = ${expectedLiteral};\n` +
        `  const lines = input.split("\\n").filter(Boolean);\n` +
        `  const result = String(solve(lines)).trim();\n` +
        `  if (result === expected) {\n` +
        `    console.log("PASS");\n` +
        `  } else {\n` +
        `    console.log("FAIL: got=" + result + " expected=" + expected);\n` +
        `  }\n` +
        `})()`
      );
    })
    .join("\n");

  return `${userCode}\n\n${cases}\n`;
}

async function run(userCode, codeTests, tmpDir) {
  const { execa } = await import("execa");

  const scriptPath = path.join(tmpDir, "main.js");
  await fs.writeFile(scriptPath, buildTestScript(userCode, codeTests), "utf8");

  let proc;
  try {
    proc = await execa(
      "docker",
      [
        "run",
        "--rm",
        "--network", "none",
        "--memory=128m",
        "--cpus=1",
        "-v", `${tmpDir}:/code:ro`,
        IMAGE,
        "node", "/code/main.js",
      ],
      { timeout: TIMEOUT_MS, reject: false }
    );
  } catch (err) {
    if (err.timedOut) return { status: "TIME_LIMIT", output: "" };
    return { status: "RUNTIME_ERROR", output: err.stderr || err.message };
  }

  if (proc.timedOut) return { status: "TIME_LIMIT", output: "" };
  if (proc.exitCode !== 0) {
    return { status: "RUNTIME_ERROR", output: proc.stderr };
  }

  return { status: "OK", output: proc.stdout };
}

module.exports = { run };
