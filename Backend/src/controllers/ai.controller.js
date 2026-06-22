const aiService = require("../services/ai.service");

function writeSse(res, payload) {
  res.write(`data: ${JSON.stringify(payload)}\n\n`);
}

function initSse(res) {
  res.setHeader("Content-Type", "text/event-stream; charset=utf-8");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("X-Accel-Buffering", "no");
  res.flushHeaders?.();
}

async function handleStream(req, res, next, streamFn) {
  try {
    initSse(res);
    await streamFn((event) => writeSse(res, event));
    res.end();
  } catch (error) {
    if (res.headersSent) {
      writeSse(res, {
        type: "error",
        message: error.message || "Failed to get AI response",
      });
      res.end();
      return;
    }
    next(error);
  }
}

async function chat(req, res, next) {
  try {
    res.json(await aiService.globalChat(req.user.id, req.body.message || ""));
  } catch (error) {
    next(error);
  }
}

async function chatStream(req, res, next) {
  await handleStream(req, res, next, (emit) =>
    aiService.globalChatStream(req.user.id, req.body.message || "", emit)
  );
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
      await aiService.taskChat(
        req.user.id,
        Number(req.params.taskId),
        req.body.message || "",
        req.body.userCode ?? ""
      )
    );
  } catch (error) {
    next(error);
  }
}

async function taskChatStream(req, res, next) {
  await handleStream(req, res, next, (emit) =>
    aiService.taskChatStream(
      req.user.id,
      Number(req.params.taskId),
      req.body.message || "",
      req.body.userCode ?? "",
      emit
    )
  );
}

async function taskChatHistory(req, res, next) {
  try {
    res.json(await aiService.getTaskChatHistory(req.user.id, Number(req.params.taskId)));
  } catch (error) {
    next(error);
  }
}

async function resetContext(req, res, next) {
  try {
    res.json(await aiService.resetGlobalContext(req.user.id));
  } catch (error) {
    next(error);
  }
}

module.exports = {
  chat,
  chatStream,
  history,
  resetContext,
  taskChat,
  taskChatStream,
  taskChatHistory,
};
