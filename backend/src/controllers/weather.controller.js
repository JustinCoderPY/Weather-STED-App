const openWeatherService = require("../services/openWeather.service");
const { validateCoordinates, validateUnits } = require("../utils/validators");
const {
  formatCurrentWeather,
  formatFullWeather
} = require("../utils/formatWeather");

const getCurrentWeather = async (req, res, next) => {
  try {
    const coordinates = validateCoordinates(req.query);
    const units = validateUnits(req.query.units);
    const weather = await openWeatherService.getCurrentWeather({
      ...coordinates,
      units
    });

    res.json(formatCurrentWeather(weather.data, coordinates, {
      units,
      cached: weather.cached
    }));
  } catch (error) {
    next(error);
  }
};

const getFullWeather = async (req, res, next) => {
  try {
    const coordinates = validateCoordinates(req.query);
    const units = validateUnits(req.query.units);
    const [currentWeatherResult, forecastWeatherResult] = await Promise.all([
      openWeatherService.getCurrentWeather({
        ...coordinates,
        units
      }),
      openWeatherService.getForecastWeather({
        ...coordinates,
        units
      })
    ]);

    res.json(
      formatFullWeather(
        currentWeatherResult.data,
        forecastWeatherResult.data,
        coordinates,
        {
          units,
          cached: currentWeatherResult.cached && forecastWeatherResult.cached
        }
      )
    );
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCurrentWeather,
  getFullWeather
};
