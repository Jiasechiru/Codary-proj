const dailyChallengeService = require("../services/dailyChallenge.service");

async function getStatus(req, res, next) {
  try {
    res.json(await dailyChallengeService.getStatus(req.user.id));
  } catch (error) {
    next(error);
  }
}

async function getDailyChallenge(req, res, next) {
  try {
    res.json(await dailyChallengeService.getDailyChallenge(req.user.id, req.params.language));
  } catch (error) {
    next(error);
  }
}

async function submit(req, res, next) {
  try {
    const result = await dailyChallengeService.submit(
      req.user.id,
      req.body.language,
      req.body.code
    );
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getStatus,
  getDailyChallenge,
  submit,
};
