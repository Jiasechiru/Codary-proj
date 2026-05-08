const aiService = require("../services/ai.service");

async function chat(req, res, next) {
  try {
    res.json(await aiService.globalChat(req.user.id, req.body.message || ""));
  } catch (error) {
    next(error);
  }
}

async function history(req, res, next) {
  try {
    res.json(await aiService.getGlobalHistory(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function taskChat(req, res, next) {
  try {
    res.json(
      await aiService.taskChat(req.user.id, Number(req.params.taskId), req.body.message || "")
    );
  } catch (error) {
    next(error);
  }
}

module.exports = {
  chat,
  history,
  taskChat,
};
