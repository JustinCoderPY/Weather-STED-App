const locationStoreService = require("../services/locationStore.service");
const openWeatherService = require("../services/openWeather.service");
const settingsStoreService = require("../services/settingsStore.service");
const { formatFullWeather } = require("../utils/formatWeather");

const buildNotFoundError = () => {
  const error = new Error("Saved location not found.");
  error.statusCode = 404;
  return error;
};

const getDashboard = async (req, res, next) => {
  try {
    const settings = await settingsStoreService.getSettings();
    const savedLocations = await locationStoreService.getLocations();
    const selectedLocationId = req.query.locationId || settings.defaultLocationId;

    if (!selectedLocationId) {
      res.json({
        settings,
        savedLocations,
        selectedLocation: null,
        weather: null,
        message: "No location selected yet."
      });
      return;
    }

    const selectedLocation = savedLocations.find(
      (location) => location.id === selectedLocationId
    );

    if (!selectedLocation) {
      throw buildNotFoundError();
    }

    const units = settings.temperatureUnit;
    const [currentWeatherResult, forecastWeatherResult] = await Promise.all([
      openWeatherService.getCurrentWeather({
        lat: selectedLocation.lat,
        lon: selectedLocation.lon,
        units
      }),
      openWeatherService.getForecastWeather({
        lat: selectedLocation.lat,
        lon: selectedLocation.lon,
        units
      })
    ]);

    const weather = formatFullWeather(
      currentWeatherResult.data,
      forecastWeatherResult.data,
      {
        lat: selectedLocation.lat,
        lon: selectedLocation.lon
      },
      {
        units,
        cached: currentWeatherResult.cached && forecastWeatherResult.cached
      }
    );

    res.json({
      settings,
      savedLocations,
      selectedLocation,
      weather
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard
};
