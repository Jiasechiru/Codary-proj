const { Queue } = require("bullmq");
const { redisConnection } = require("../utils/redis");

const submissionQueue = new Queue("submissions", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

module.exports = submissionQueue;
