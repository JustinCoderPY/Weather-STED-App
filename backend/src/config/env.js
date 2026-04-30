const dotenv = require("dotenv");

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

module.exports = {
  port: toNumber(process.env.PORT, 5001),
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  openWeatherBaseUrl:
    process.env.OPENWEATHER_BASE_URL || "https://api.openweathermap.org",
  cacheTtlSeconds: toNumber(process.env.CACHE_TTL_SECONDS, 300)
};
