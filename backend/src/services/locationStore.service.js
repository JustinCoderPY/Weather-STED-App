const fs = require("fs/promises");
const path = require("path");

const dataPath = path.join(__dirname, "../data/savedLocations.json");

const readLocations = async () => {
  const file = await fs.readFile(dataPath, "utf8");
  return JSON.parse(file);
};

const writeLocations = async (locations) => {
  await fs.writeFile(dataPath, `${JSON.stringify(locations, null, 2)}\n`);
};

const getLocations = async () => readLocations();

const addLocation = async (locationInput) => {
  const locations = await readLocations();
  const duplicate = locations.find(
    (location) =>
      Number(location.lat) === locationInput.lat &&
      Number(location.lon) === locationInput.lon
  );

  if (duplicate) {
    const error = new Error("Location is already saved.");
    error.statusCode = 409;
    throw error;
  }

  const location = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    name: locationInput.name,
    state: locationInput.state || null,
    country: locationInput.country,
    lat: locationInput.lat,
    lon: locationInput.lon,
    createdAt: new Date().toISOString()
  };

  locations.push(location);
  await writeLocations(locations);

  return location;
};

const deleteLocation = async (id) => {
  const locations = await readLocations();
  const nextLocations = locations.filter((location) => location.id !== id);

  if (nextLocations.length === locations.length) {
    const error = new Error("Saved location not found.");
    error.statusCode = 404;
    throw error;
  }

  await writeLocations(nextLocations);
};

module.exports = {
  getLocations,
  addLocation,
  deleteLocation
};
