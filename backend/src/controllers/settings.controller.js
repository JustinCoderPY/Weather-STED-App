const settingsStoreService = require("../services/settingsStore.service");
const { validateSettingsPatch } = require("../utils/validators");

const getSettings = async (req, res, next) => {
  try {
    const settings = await settingsStoreService.getSettings();
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

const updateSettings = async (req, res, next) => {
  try {
    const settingsPatch = validateSettingsPatch(req.body);
    const settings = await settingsStoreService.updateSettings(settingsPatch);
    res.json(settings);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSettings,
  updateSettings
};
