const tasksService = require("../services/tasks.service");

async function getTask(req, res, next) {
  try {
    res.json(await tasksService.getTaskById(Number(req.params.id), req.user.id));
  } catch (error) {
    next(error);
  }
}

async function submitTask(req, res, next) {
  try {
    const result = await tasksService.submitTask(
      req.user.id,
      Number(req.params.id),
      req.body.code
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function getAttempts(req, res, next) {
  try {
    const data = await tasksService.getTaskAttempts(req.user.id, Number(req.params.id));
    res.json(data);
  } catch (error) {
    next(error);
  }
}

async function getAttemptStatus(req, res, next) {
  try {
    const result = await tasksService.getAttemptStatus(
      req.user.id,
      Number(req.params.attemptId)
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getTask,
  submitTask,
  getAttempts,
  getAttemptStatus,
};
