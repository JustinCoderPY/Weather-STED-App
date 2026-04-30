const createValidationError = (message) => {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
};

const validateCoordinates = ({ lat, lon }) => {
  if (lat === undefined || lon === undefined || lat === "" || lon === "") {
    throw createValidationError("Latitude and longitude are required.");
  }

  const parsedLat = Number(lat);
  const parsedLon = Number(lon);

  if (!Number.isFinite(parsedLat) || !Number.isFinite(parsedLon)) {
    throw createValidationError("Latitude and longitude must be valid numbers.");
  }

  if (parsedLat < -90 || parsedLat > 90) {
    throw createValidationError("Latitude must be between -90 and 90.");
  }

  if (parsedLon < -180 || parsedLon > 180) {
    throw createValidationError("Longitude must be between -180 and 180.");
  }

  return {
    lat: parsedLat,
    lon: parsedLon
  };
};

const validateQuery = (query) => {
  if (!query || !String(query).trim()) {
    throw createValidationError("Search query is required.");
  }

  return String(query).trim();
};

const validateUnits = (units = "imperial") => {
  const cleanUnits = String(units).trim().toLowerCase();
  const allowedUnits = ["standard", "metric", "imperial"];

  if (!allowedUnits.includes(cleanUnits)) {
    throw createValidationError(
      "Units must be one of: standard, metric, imperial."
    );
  }

  return cleanUnits;
};

const validateLocationType = (locationType = "city") => {
  const cleanLocationType = String(locationType || "city").trim().toLowerCase();
  const allowedLocationTypes = ["city", "suburb", "rural", "park"];

  if (!allowedLocationTypes.includes(cleanLocationType)) {
    throw createValidationError(
      "Location type must be one of: city, suburb, rural, park."
    );
  }

  return cleanLocationType;
};

const validateSavedLocation = (location = {}) => {
  const name = location.name ? String(location.name).trim() : "";
  const state = location.state ? String(location.state).trim() : "";
  const country = location.country ? String(location.country).trim() : "";
  const coordinates = validateCoordinates(location);
  const locationType = validateLocationType(location.locationType);

  if (!name) {
    throw createValidationError("Location name is required.");
  }

  if (!country) {
    throw createValidationError("Country is required.");
  }

  return {
    name,
    state: state || null,
    country,
    locationType,
    ...coordinates
  };
};

const validateSavedLocationPatch = (location = {}) => {
  const patch = {};

  if (Object.prototype.hasOwnProperty.call(location, "locationType")) {
    patch.locationType = validateLocationType(location.locationType);
  }

  if (!Object.keys(patch).length) {
    throw createValidationError("At least one location field is required.");
  }

  return patch;
};

const validateSettingsPatch = (settings = {}) => {
  const patch = {};

  if (Object.prototype.hasOwnProperty.call(settings, "temperatureUnit")) {
    const temperatureUnit = String(settings.temperatureUnit).trim().toLowerCase();
    const allowedTemperatureUnits = ["imperial", "metric"];

    if (!allowedTemperatureUnits.includes(temperatureUnit)) {
      throw createValidationError(
        "Temperature unit must be one of: imperial, metric."
      );
    }

    patch.temperatureUnit = temperatureUnit;
  }

  if (Object.prototype.hasOwnProperty.call(settings, "measurementSystem")) {
    const measurementSystem = String(settings.measurementSystem)
      .trim()
      .toLowerCase();
    const allowedMeasurementSystems = ["us", "metric"];

    if (!allowedMeasurementSystems.includes(measurementSystem)) {
      throw createValidationError(
        "Measurement system must be one of: us, metric."
      );
    }

    patch.measurementSystem = measurementSystem;
  }

  if (Object.prototype.hasOwnProperty.call(settings, "themeMode")) {
    const themeMode = String(settings.themeMode).trim().toLowerCase();
    const allowedThemeModes = ["dynamic", "light", "dark"];

    if (!allowedThemeModes.includes(themeMode)) {
      throw createValidationError(
        "Theme mode must be one of: dynamic, light, dark."
      );
    }

    patch.themeMode = themeMode;
  }

  if (Object.prototype.hasOwnProperty.call(settings, "defaultLocationId")) {
    if (
      settings.defaultLocationId !== null &&
      typeof settings.defaultLocationId !== "string"
    ) {
      throw createValidationError("Default location ID must be a string or null.");
    }

    patch.defaultLocationId = settings.defaultLocationId;
  }

  return patch;
};

module.exports = {
  validateCoordinates,
  validateLocationType,
  validateQuery,
  validateUnits,
  validateSavedLocation,
  validateSavedLocationPatch,
  validateSettingsPatch
};
