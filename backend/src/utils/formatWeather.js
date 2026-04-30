const formatDateTime = (timestamp, timezoneOffset = 0) => {
  if (!timestamp) {
    return null;
  }

  return new Date((timestamp + timezoneOffset) * 1000).toISOString();
};

const formatDate = (timestamp, timezoneOffset = 0) =>
  formatDateTime(timestamp, timezoneOffset)?.slice(0, 10) || null;

const formatGeocodeResults = (results = []) =>
  results.map((location, index) => {
    const state = location.state || null;
    const country = location.country || null;
    const displayParts = [location.name, state, country].filter(Boolean);

    return {
      id: `${location.lat},${location.lon}-${index}`,
      name: location.name,
      state,
      country,
      lat: location.lat,
      lon: location.lon,
      displayName: displayParts.join(", ")
    };
  });

const formatCurrentWeather = (weather, coordinates, meta = {}) => {
  const timezoneOffset = weather.timezone || 0;
  const tempLow = weather.main?.temp_min;
  const tempHigh = weather.main?.temp_max;

  return {
    location: {
      id: weather.id,
      name: weather.name || null,
      state: null,
      country: weather.sys?.country || null,
      lat: weather.coord?.lat ?? coordinates.lat,
      lon: weather.coord?.lon ?? coordinates.lon,
      timezoneOffset,
      locationType: "city"
    },
    current: {
      time: formatDateTime(weather.dt, timezoneOffset),
      temperature: weather.main?.temp,
      feelsLike: weather.main?.feels_like,
      tempLow,
      tempHigh,
      tempMin: tempLow,
      tempMax: tempHigh,
      condition: weather.weather?.[0]?.main || null,
      description: weather.weather?.[0]?.description || null,
      icon: weather.weather?.[0]?.icon || null,
      humidity: weather.main?.humidity,
      pressure: weather.main?.pressure,
      visibility: weather.visibility,
      windSpeed: weather.wind?.speed,
      windDirection: weather.wind?.deg,
      clouds: weather.clouds?.all,
      sunrise: formatDateTime(weather.sys?.sunrise, timezoneOffset),
      sunset: formatDateTime(weather.sys?.sunset, timezoneOffset)
    },
    meta: {
      units: meta.units || null,
      source: "OpenWeather 2.5 weather",
      cached: Boolean(meta.cached)
    }
  };
};

const formatHourlyForecast = (items = [], timezoneOffset = 0) =>
  items.map((item) => ({
    time: formatDateTime(item.dt, timezoneOffset),
    temperature: item.main?.temp,
    feelsLike: item.main?.feels_like,
    condition: item.weather?.[0]?.main || null,
    description: item.weather?.[0]?.description || null,
    icon: item.weather?.[0]?.icon || null,
    precipitationChance: item.pop ?? null,
    humidity: item.main?.humidity,
    windSpeed: item.wind?.speed
  }));

const getRepresentativeForecast = (items, timezoneOffset) =>
  items.reduce((best, item) => {
    if (!best) {
      return item;
    }

    const itemHour = new Date((item.dt + timezoneOffset) * 1000).getUTCHours();
    const bestHour = new Date((best.dt + timezoneOffset) * 1000).getUTCHours();
    return Math.abs(itemHour - 12) < Math.abs(bestHour - 12) ? item : best;
  }, null);

const groupDailyForecast = (items = [], timezoneOffset = 0) => {
  const groups = items.reduce((grouped, item) => {
    const date = formatDate(item.dt, timezoneOffset);

    if (!grouped[date]) {
      grouped[date] = [];
    }

    grouped[date].push(item);
    return grouped;
  }, {});

  return Object.entries(groups).map(([date, dayItems]) => {
    const representative = getRepresentativeForecast(dayItems, timezoneOffset);
    const temperatures = dayItems
      .flatMap((item) => [item.main?.temp_min, item.main?.temp_max])
      .filter((temperature) => Number.isFinite(temperature));
    const precipitationChances = dayItems
      .map((item) => item.pop)
      .filter((chance) => Number.isFinite(chance));

    const tempLow = temperatures.length ? Math.min(...temperatures) : null;
    const tempHigh = temperatures.length ? Math.max(...temperatures) : null;

    return {
      date,
      tempLow,
      tempHigh,
      tempMin: tempLow,
      tempMax: tempHigh,
      condition: representative?.weather?.[0]?.main || null,
      description: representative?.weather?.[0]?.description || null,
      icon: representative?.weather?.[0]?.icon || null,
      precipitationChance: precipitationChances.length
        ? Math.max(...precipitationChances)
        : null
    };
  });
};

const formatFullWeather = (
  currentWeather,
  forecastWeather,
  coordinates,
  meta = {}
) => {
  const timezoneOffset =
    forecastWeather.city?.timezone ?? currentWeather.timezone ?? 0;
  const current = formatCurrentWeather(currentWeather, coordinates);
  const hourly = formatHourlyForecast(forecastWeather.list, timezoneOffset);
  const daily = groupDailyForecast(forecastWeather.list, timezoneOffset);

  return {
    location: {
      id: forecastWeather.city?.id ?? current.location.id,
      name: forecastWeather.city?.name ?? current.location.name,
      state: null,
      country: forecastWeather.city?.country ?? current.location.country,
      lat: forecastWeather.city?.coord?.lat ?? current.location.lat,
      lon: forecastWeather.city?.coord?.lon ?? current.location.lon,
      timezoneOffset,
      locationType: "city"
    },
    current: current.current,
    hourly,
    daily,
    alerts: [],
    meta: {
      units: meta.units || null,
      source: "OpenWeather 2.5 weather + forecast",
      cached: Boolean(meta.cached)
    }
  };
};

module.exports = {
  formatGeocodeResults,
  formatCurrentWeather,
  formatFullWeather
};
