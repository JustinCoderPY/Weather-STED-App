const dotenv = require("dotenv");

dotenv.config();

const toNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

module.exports = {
  port: toNumber(process.env.PORT, 5001),
  corsOrigins: (
    process.env.CORS_ORIGINS ||
    "http://localhost:5173,http://localhost:5174,http://localhost:4173,http://127.0.0.1:5173,http://127.0.0.1:5174,http://127.0.0.1:4173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY,
  openWeatherBaseUrl:
    process.env.OPENWEATHER_BASE_URL || "https://api.openweathermap.org",
  cacheTtlSeconds: toNumber(process.env.CACHE_TTL_SECONDS, 300)
};
