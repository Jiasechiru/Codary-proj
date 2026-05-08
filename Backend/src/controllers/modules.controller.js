const modulesService = require("../services/modules.service");

async function getModule(req, res, next) {
  try {
    res.json(await modulesService.getModuleById(Number(req.params.id)));
  } catch (error) {
    next(error);
  }
}

module.exports = { getModule };
