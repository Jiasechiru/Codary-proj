const OpenAI = require("openai");
const { DEFAULT_BASE_URL } = require("./deepseekConfig");

const client = new OpenAI({
  baseURL: process.env.DEEPSEEK_BASE_URL || DEFAULT_BASE_URL,
  apiKey: process.env.DEEPSEEK_API_KEY,
});

module.exports = client;
