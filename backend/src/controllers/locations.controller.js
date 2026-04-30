const locationStoreService = require("../services/locationStore.service");
const { validateSavedLocation } = require("../utils/validators");

const getLocations = async (req, res, next) => {
  try {
    const locations = await locationStoreService.getLocations();
    res.json({
      locations
    });
  } catch (error) {
    next(error);
  }
};

const addLocation = async (req, res, next) => {
  try {
    const locationInput = validateSavedLocation(req.body);
    const location = await locationStoreService.addLocation(locationInput);

    res.status(201).json({
      location
    });
  } catch (error) {
    next(error);
  }
};

const deleteLocation = async (req, res, next) => {
  try {
    await locationStoreService.deleteLocation(req.params.id);
    res.json({
      success: true,
      message: "Location deleted."
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLocations,
  addLocation,
  deleteLocation
};
