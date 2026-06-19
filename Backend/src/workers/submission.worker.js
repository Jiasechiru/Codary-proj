const { Worker } = require("bullmq");
const { redisConnection } = require("../utils/redis");
const taskRunnerService = require("../services/taskRunner.service");

function createSubmissionWorker() {
  const worker = new Worker(
    "submissions",
    async (job) => {
      const { attemptId } = job.data;
      return taskRunnerService.process(attemptId);
    },
    {
      connection: redisConnection,
      concurrency: 5,
    }
  );

  worker.on("completed", (job) => {
    console.log(`[Worker] Job ${job.id} completed (attemptId=${job.data.attemptId})`);
  });

  worker.on("failed", (job, err) => {
    console.error(`[Worker] Job ${job?.id} failed (attemptId=${job?.data?.attemptId}):`, err.message);
  });

  return worker;
}

module.exports = { createSubmissionWorker };
