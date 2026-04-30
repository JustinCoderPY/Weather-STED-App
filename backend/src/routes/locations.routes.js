const express = require("express");
const locationsController = require("../controllers/locations.controller");

const router = express.Router();

router.get("/", locationsController.getLocations);
router.post("/", locationsController.addLocation);
router.patch("/:id", locationsController.updateLocation);
router.delete("/:id", locationsController.deleteLocation);

module.exports = router;
