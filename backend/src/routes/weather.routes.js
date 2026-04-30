const express = require("express");
const weatherController = require("../controllers/weather.controller");

const router = express.Router();

router.get("/current", weatherController.getCurrentWeather);
router.get("/full", weatherController.getFullWeather);

module.exports = router;
