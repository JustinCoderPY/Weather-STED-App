const env = require("../config/env");
const cache = require("./cache.service");
const { formatGeocodeResults } = require("../utils/formatWeather");

const fetchJson = async (path, params) => {
  if (!env.openWeatherApiKey) {
    const error = new Error("OpenWeather API key is not configured.");
    error.statusCode = 500;
    throw error;
  }

  const url = new URL(path, env.openWeatherBaseUrl);
  url.searchParams.set("appid", env.openWeatherApiKey);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, value);
    }
  });

  const response = await fetch(url);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(
      data.message || "OpenWeather request failed. Please try again."
    );
    error.statusCode = response.status;
    throw error;
  }

  return data;
};

const getCachedJson = async (key, path, params) => {
  const cached = cache.get(key);

  if (cached) {
    return cached;
  }

  const data = await fetchJson(path, params);
  cache.set(key, data, env.cacheTtlSeconds);
  return data;
};

const getCachedWeatherJson = async (key, path, params) => {
  const cached = cache.get(key);

  if (cached) {
    return {
      data: cached,
      cached: true
    };
  }

  const data = await fetchJson(path, params);
  cache.set(key, data, env.cacheTtlSeconds);

  return {
    data,
    cached: false
  };
};

const searchLocations = async (query) => {
  const key = cache.buildKey("geocode", "search", query);
  const data = await getCachedJson(key, "/geo/1.0/direct", {
    q: query,
    limit: 5
  });

  return formatGeocodeResults(data);
};

const reverseGeocode = async ({ lat, lon }) => {
  const key = cache.buildKey("geocode", "reverse", lat, lon);
  const data = await getCachedJson(key, "/geo/1.0/reverse", {
    lat,
    lon,
    limit: 5
  });

  return formatGeocodeResults(data);
};

const getCurrentWeather = async ({ lat, lon, units }) => {
  const key = cache.buildKey("weather", "current", lat, lon, units);

  return getCachedWeatherJson(key, "/data/2.5/weather", {
    lat,
    lon,
    units
  });
};

const getForecastWeather = async ({ lat, lon, units }) => {
  const key = cache.buildKey("weather", "forecast", lat, lon, units);

  return getCachedWeatherJson(key, "/data/2.5/forecast", {
    lat,
    lon,
    units
  });
};

module.exports = {
  searchLocations,
  reverseGeocode,
  getCurrentWeather,
  getForecastWeather
};
