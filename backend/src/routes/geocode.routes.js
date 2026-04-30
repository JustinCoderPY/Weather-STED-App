const express = require("express");
const geocodeController = require("../controllers/geocode.controller");

const router = express.Router();

router.get("/search", geocodeController.searchLocations);
router.get("/reverse", geocodeController.reverseGeocode);

module.exports = router;
