const fs = require("fs/promises");
const path = require("path");
const os = require("os");
const prisma = require("../prisma/client");
const AppError = require("../utils/AppError");
const { getAdapter } = require("../adapters/adapter.factory");
const { recordLearningActivity } = require("./progress.service");

const DAY_MS = 24 * 60 * 60 * 1000;

// Estimated learning time credited for solving the daily challenge, by difficulty.
const DIFFICULTY_TIME_SECONDS = {
  easy: 10 * 60,
  medium: 15 * 60,
  hard: 25 * 60,
};

const SUPPORTED_LANGUAGES = ["javascript", "c"];

function startOfDay(date) {
  const result = new Date(date);
  result.setHours(0, 0, 0, 0);
  return result;
}

function normalizeLanguage(language) {
  const value = String(language || "").toLowerCase();
  const normalized = value === "js" ? "javascript" : value;
  if (!SUPPORTED_LANGUAGES.includes(normalized)) {
    throw new AppError("Unsupported language. Use 'javascript' or 'c'.", 400);
  }
  return normalized;
}

/**
 * Deterministically selects today's challenge for a language: the same problem
 * is served to everyone on a given day, rotating through the available pool.
 */
async function pickTodaysChallenge(language) {
  const pool = await prisma.dailyChallenge.findMany({
    where: { language },
    orderBy: { id: "asc" },
  });

  if (pool.length === 0) {
    throw new AppError("No daily challenge is available for this language yet.", 404);
  }

  const dayIndex = Math.floor(Date.now() / DAY_MS);
  return pool[dayIndex % pool.length];
}

async function hasCompletedToday(userId) {
  const today = startOfDay(new Date());
  const existing = await prisma.userDailyChallenge.findUnique({
    where: { userId_date: { userId, date: today } },
  });
  return Boolean(existing);
}

function toPublicChallenge(challenge) {
  const tests = Array.isArray(challenge.tests) ? challenge.tests : [];
  return {
    id: challenge.id,
    title: challenge.title,
    description: challenge.description,
    language: challenge.language,
    difficulty: challenge.difficulty,
    starterCode: challenge.starterCode,
    tests: tests.map((test) => ({
      input: test.input,
      expectedOutput: test.expectedOutput,
    })),
  };
}

async function getStatus(userId) {
  return { completedToday: await hasCompletedToday(userId) };
}

async function getDailyChallenge(userId, language) {
  const normalized = normalizeLanguage(language);
  const challenge = await pickTodaysChallenge(normalized);
  return {
    challenge: toPublicChallenge(challenge),
    completedToday: await hasCompletedToday(userId),
  };
}

function evaluateOutput(rawOutput) {
  const lines = rawOutput
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return "RUNTIME_ERROR";
  }

  return lines.every((line) => line === "PASS") ? "SUCCESS" : "FAILED";
}

async function submit(userId, language, code) {
  const normalized = normalizeLanguage(language);
  const challenge = await pickTodaysChallenge(normalized);
  const adapter = getAdapter(normalized);
  const tests = Array.isArray(challenge.tests) ? challenge.tests : [];

  const tmpDir = await fs.mkdtemp(path.join(os.tmpdir(), `codary-daily-${challenge.id}-`));

  let runResult;
  try {
    runResult = await adapter.run(code, tests, tmpDir);
  } finally {
    await fs.rm(tmpDir, { recursive: true, force: true });
  }

  const status = runResult.status === "OK" ? evaluateOutput(runResult.output) : runResult.status;
  const isCorrect = status === "SUCCESS";

  const alreadyCompleted = await hasCompletedToday(userId);

  if (isCorrect && !alreadyCompleted) {
    const today = startOfDay(new Date());
    await prisma.userDailyChallenge.create({
      data: { userId, dailyChallengeId: challenge.id, date: today },
    });

    const seconds = DIFFICULTY_TIME_SECONDS[challenge.difficulty] ?? DIFFICULTY_TIME_SECONDS.medium;
    await recordLearningActivity(userId, seconds);
  }

  return {
    status,
    isCorrect,
    alreadyCompleted,
    completedToday: isCorrect || alreadyCompleted,
    message: runResult.output && status !== "SUCCESS" ? runResult.output : undefined,
  };
}

module.exports = {
  getStatus,
  getDailyChallenge,
  submit,
};
