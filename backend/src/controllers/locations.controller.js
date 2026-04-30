const locationStoreService = require("../services/locationStore.service");
const {
  validateSavedLocation,
  validateSavedLocationPatch
} = require("../utils/validators");

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

const updateLocation = async (req, res, next) => {
  try {
    const locationPatch = validateSavedLocationPatch(req.body);
    const location = await locationStoreService.updateLocation(
      req.params.id,
      locationPatch
    );

    res.json({
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
  updateLocation,
  deleteLocation
};
