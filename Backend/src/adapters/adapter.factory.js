const javascriptAdapter = require("./javascript.adapter");
const cAdapter = require("./c.adapter");

const ADAPTERS = {
  javascript: javascriptAdapter,
  js: javascriptAdapter,
  c: cAdapter,
};

/**
 * Returns the language adapter for the given language key.
 * Throws if the language is not supported.
 */
function getAdapter(language) {
  const adapter = ADAPTERS[language?.toLowerCase()];
  if (!adapter) {
    throw new Error(`Unsupported language: ${language}`);
  }
  return adapter;
}

module.exports = { getAdapter };
