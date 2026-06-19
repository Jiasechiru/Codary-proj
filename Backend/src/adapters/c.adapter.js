const path = require("path");
const fs = require("fs/promises");

const IMAGE = "codary-runner-c";
const TIMEOUT_MS = 3000;

/**
 * Builds a shell script that compiles main.c and runs it once per test case,
 * feeding stdin and comparing stdout to the expected output.
 */
function buildRunScript(codeTests) {
  const checks = codeTests
    .map((t, i) => {
      // Write each input as a heredoc to avoid quoting issues
      const inputEscaped = t.input.replace(/\\/g, "\\\\").replace(/'/g, "'\\''");
      const expectedEscaped = t.expectedOutput.trim().replace(/\\/g, "\\\\").replace(/'/g, "'\\''");
      return (
        `INPUT_${i}='${inputEscaped}'\n` +
        `EXPECTED_${i}='${expectedEscaped}'\n` +
        `RESULT_${i}=$(printf '%s' "$INPUT_${i}" | /code/solution 2>/dev/null)\n` +
        `if [ "$(printf '%s' "$RESULT_${i}" | tr -d '\\r')" = "$EXPECTED_${i}" ]; then\n` +
        `  echo "PASS"\n` +
        `else\n` +
        `  echo "FAIL: got=$(printf '%s' "$RESULT_${i}") expected=$EXPECTED_${i}"\n` +
        `fi`
      );
    })
    .join("\n");

  return `#!/bin/sh\nset -e\ngcc -o /code/solution /code/main.c 2>/tmp/compile_err || { cat /tmp/compile_err; exit 2; }\n${checks}\n`;
}

async function run(userCode, codeTests, tmpDir) {
  const { execa } = await import("execa");

  await fs.writeFile(path.join(tmpDir, "main.c"), userCode, "utf8");
  const runScript = buildRunScript(codeTests);
  const scriptPath = path.join(tmpDir, "run.sh");
  await fs.writeFile(scriptPath, runScript, "utf8");
  await fs.chmod(scriptPath, 0o755);

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
        "-v", `${tmpDir}:/code`,
        IMAGE,
        "sh", "/code/run.sh",
      ],
      { timeout: TIMEOUT_MS, reject: false }
    );
  } catch (err) {
    if (err.timedOut) return { status: "TIME_LIMIT", output: "" };
    return { status: "RUNTIME_ERROR", output: err.stderr || err.message };
  }

  if (proc.timedOut) return { status: "TIME_LIMIT", output: "" };

  // gcc exits with code 2 on compilation error (see run.sh)
  if (proc.exitCode === 2) {
    return { status: "COMPILATION_ERROR", output: proc.stdout + proc.stderr };
  }
  if (proc.exitCode !== 0) {
    return { status: "RUNTIME_ERROR", output: proc.stderr };
  }

  return { status: "OK", output: proc.stdout };
}

module.exports = { run };
