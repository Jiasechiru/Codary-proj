const quizzesService = require("../services/quizzes.service");

async function getQuiz(req, res, next) {
  try {
    res.json(await quizzesService.getQuizById(Number(req.params.id), req.user.id));
  } catch (error) {
    next(error);
  }
}

async function submitQuiz(req, res, next) {
  try {
    const result = await quizzesService.submitQuiz(
      req.user.id,
      Number(req.params.id),
      req.body.answer
    );
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getQuiz,
  submitQuiz,
};
