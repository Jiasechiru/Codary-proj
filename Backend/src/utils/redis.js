const { Redis } = require("ioredis");

const redisConnection = new Redis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
});

module.exports = { redisConnection };
