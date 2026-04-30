const express = require("express");
const cors = require("cors");

const dashboardRoutes = require("./routes/dashboard.routes");
const geocodeRoutes = require("./routes/geocode.routes");
const locationsRoutes = require("./routes/locations.routes");
const settingsRoutes = require("./routes/settings.routes");
const weatherRoutes = require("./routes/weather.routes");
const errorMiddleware = require("./middleware/error.middleware");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "Weather backend is running"
  });
});

app.use("/api/dashboard", dashboardRoutes);
app.use("/api/geocode", geocodeRoutes);
app.use("/api/locations", locationsRoutes);
app.use("/api/settings", settingsRoutes);
app.use("/api/weather", weatherRoutes);

app.use(errorMiddleware.notFound);
app.use(errorMiddleware.handleError);

module.exports = app;
