const openWeatherService = require("../services/openWeather.service");
const { validateCoordinates, validateQuery } = require("../utils/validators");

const searchLocations = async (req, res, next) => {
  try {
    const query = validateQuery(req.query.query);
    const results = await openWeatherService.searchLocations(query);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

const reverseGeocode = async (req, res, next) => {
  try {
    const coordinates = validateCoordinates(req.query);
    const results = await openWeatherService.reverseGeocode(coordinates);
    res.json(results);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  searchLocations,
  reverseGeocode
};
