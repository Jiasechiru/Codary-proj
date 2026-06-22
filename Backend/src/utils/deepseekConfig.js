// DeepSeek API (OpenAI-compatible): https://api-docs.deepseek.com
// Current models: deepseek-v4-flash, deepseek-v4-pro
// Legacy aliases deepseek-chat / deepseek-reasoner retire 2026-07-24 UTC.

const DEFAULT_MODEL = "deepseek-v4-flash";
const DEFAULT_BASE_URL = "https://api.deepseek.com";

function getDeepSeekModel() {
  return process.env.DEEPSEEK_MODEL || DEFAULT_MODEL;
}

function isThinkingEnabled() {
  return process.env.DEEPSEEK_THINKING === "enabled";
}

function buildChatCompletionRequest(systemPrompt, contextMessages, options = {}) {
  const thinkingEnabled = isThinkingEnabled();
  const stream = options.stream === true;

  // Node OpenAI SDK serializes the body as-is (no extra_body merge like Python SDK).
  // DeepSeek expects top-level `thinking`: https://api-docs.deepseek.com/api/create-chat-completion
  const request = {
    model: getDeepSeekModel(),
    messages: [{ role: "system", content: systemPrompt }, ...contextMessages],
    max_tokens: Number(process.env.DEEPSEEK_MAX_TOKENS) || 1024,
    stream,
    thinking: { type: thinkingEnabled ? "enabled" : "disabled" },
  };

  // temperature / top_p only apply in non-thinking mode (per DeepSeek docs).
  if (!thinkingEnabled) {
    request.temperature = Number(process.env.DEEPSEEK_TEMPERATURE) || 0.7;
  } else {
    request.reasoning_effort = process.env.DEEPSEEK_REASONING_EFFORT || "high";
  }

  return request;
}

function extractAssistantContent(completion) {
  const message = completion.choices[0]?.message;
  if (!message) {
    return null;
  }

  const content = message.content?.trim();
  if (content) {
    return content;
  }

  // Fallback: thinking mode should still populate content with the final answer.
  const reasoning = message.reasoning_content?.trim();
  return reasoning || null;
}

module.exports = {
  DEFAULT_MODEL,
  DEFAULT_BASE_URL,
  getDeepSeekModel,
  isThinkingEnabled,
  buildChatCompletionRequest,
  extractAssistantContent,
};
