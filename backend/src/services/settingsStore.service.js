const fs = require("fs/promises");
const path = require("path");

const dataPath = path.join(__dirname, "../data/userSettings.json");

const defaultSettings = {
  temperatureUnit: "imperial",
  measurementSystem: "us",
  themeMode: "dynamic",
  defaultLocationId: null
};

const readSettings = async () => {
  const file = await fs.readFile(dataPath, "utf8");
  return {
    ...defaultSettings,
    ...JSON.parse(file)
  };
};

const writeSettings = async (settings) => {
  await fs.writeFile(dataPath, `${JSON.stringify(settings, null, 2)}\n`);
};

const getSettings = async () => readSettings();

const updateSettings = async (settingsPatch) => {
  const currentSettings = await readSettings();
  const nextSettings = {
    ...currentSettings,
    ...settingsPatch
  };

  await writeSettings(nextSettings);
  return nextSettings;
};

module.exports = {
  getSettings,
  updateSettings
};
