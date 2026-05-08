const usersService = require("../services/users.service");

async function getProfile(req, res, next) {
  try {
    const profile = await usersService.getProfile(req.user.id);
    res.json(profile);
  } catch (error) {
    next(error);
  }
}

async function getActivity(req, res, next) {
  try {
    const activity = await usersService.getActivity(req.user.id);
    res.json(activity);
  } catch (error) {
    next(error);
  }
}

async function getSettings(req, res, next) {
  try {
    const settings = await usersService.getSettings(req.user.id);
    res.json(settings);
  } catch (error) {
    next(error);
  }
}

async function updateSettings(req, res, next) {
  try {
    const result = await usersService.updateSettings(req.user.id, req.body.settings);
    res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfile,
  getActivity,
  getSettings,
  updateSettings,
};
