import React, { useCallback, useEffect, useMemo, useState } from "react";
import { addLocation, deleteLocation, getDashboard, searchLocations, updateSettings } from "./api/weatherApi.js";
import { Background } from "./components/Backgrounds.jsx";
import { Icon } from "./components/Icons.jsx";
import LocationConsentScreen from "./screens/LocationConsentScreen.jsx";
import SignInScreen from "./screens/SignInScreen.jsx";
import SignUpScreen from "./screens/SignUpScreen.jsx";
import WelcomeScreen from "./screens/WelcomeScreen.jsx";
import { mockSettings, mockWeather } from "./data/mockWeather.js";

const LOCATION_TYPES = [
  { label: "City", value: "city" },
  { label: "Suburb", value: "suburb" },
  { label: "Rural", value: "rural" },
  { label: "Park", value: "park" }
];

const defaultDashboard = {
  settings: {
    ...mockSettings,
    defaultLocationId: null
  },
  savedLocations: [],
  selectedLocation: null,
  weather: null
};

const formatDateLabel = (value) =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    timeZone: value ? "UTC" : undefined
  }).format(value ? new Date(value) : new Date());

const asTemp = (value) => (Number.isFinite(Number(value)) ? Math.round(Number(value)) : "--");

const formatTime = (value) => {
  if (!value) return "--";
  if (!String(value).includes("T")) return value;

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC"
  }).format(new Date(value));
};

const formatDayLabel = (value, index) => {
  if (!value || !String(value).includes("-")) return value || `Day ${index + 1}`;
  if (index === 0) return "Today";

  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    timeZone: "UTC"
  }).format(new Date(`${value}T12:00:00Z`));
};

const normalizeLocationType = (locationType) => {
  const value = String(locationType || "city").toLowerCase();
  return LOCATION_TYPES.some((type) => type.value === value) ? value : "city";
};

const normalizeWeatherCondition = (condition = "") => {
  const value = String(condition).toLowerCase();
  if (value.includes("thunder") || value.includes("storm") || value.includes("squall") || value.includes("tornado")) return "storm";
  if (value.includes("rain") || value.includes("drizzle")) return "rain";
  if (value.includes("snow") || value.includes("sleet")) return "snow";
  if (value.includes("mist") || value.includes("fog") || value.includes("haze") || value.includes("smoke") || value.includes("dust") || value.includes("ash") || value.includes("sand")) return "fog";
  if (value.includes("clear")) return "clear";
  if (value.includes("cloud") || value.includes("overcast")) return "cloudy";
  return "cloudy";
};

const getTimeOfDay = (timezoneOffset = 0, localTime) => {
  const date = localTime ? new Date(localTime) : new Date(Date.now() + Number(timezoneOffset || 0) * 1000);
  const hour = date.getUTCHours();

  if (hour >= 5 && hour < 11) return "morning";
  if (hour >= 11 && hour < 17) return "day";
  if (hour >= 17 && hour < 20) return "sunset";
  return "night";
};

const formatWindSpeed = (windSpeed, units) => {
  if (!Number.isFinite(Number(windSpeed))) return windSpeed || "--";
  const rounded = Math.round(Number(windSpeed));
  if (units === "metric") return `${rounded} m/s`;
  if (units === "standard") return `${rounded} m/s`;
  return `${rounded} mph`;
};

const formatVisibility = (visibility, units) => {
  if (!Number.isFinite(Number(visibility))) return visibility || "--";
  const meters = Number(visibility);
  if (units === "metric") return `${(meters / 1000).toFixed(meters >= 10000 ? 0 : 1)} km`;
  return `${Math.round(meters / 1609)} mi`;
};

const normalizeWeather = (weather, selectedLocation = mockWeather.location) => {
  const source = weather || mockWeather;

  return {
    ...mockWeather,
    ...source,
    location: {
      ...mockWeather.location,
      ...source.location,
      ...selectedLocation
    },
    current: {
      ...mockWeather.current,
      ...source.current,
      tempHigh: asTemp(source.current?.tempHigh ?? source.current?.tempMax ?? mockWeather.current.tempMax),
      tempLow: asTemp(source.current?.tempLow ?? source.current?.tempMin ?? mockWeather.current.tempMin),
      sunrise: formatTime(source.current?.sunrise || mockWeather.current.sunrise),
      sunset: formatTime(source.current?.sunset || mockWeather.current.sunset)
    },
    hourly: (source.hourly?.length ? source.hourly : mockWeather.hourly).map((hour, index) => ({
      ...hour,
      id: hour.id || `${hour.time || "hour"}-${index}`,
      time: formatTime(hour.time),
      temperature: asTemp(hour.temperature)
    })),
    daily: (source.daily?.length ? source.daily : mockWeather.daily).map((day, index) => ({
      ...day,
      id: day.id || `${day.date || "day"}-${index}`,
      date: formatDayLabel(day.date, index),
      tempMax: asTemp(day.tempMax),
      tempMin: asTemp(day.tempMin),
      tempHigh: asTemp(day.tempHigh ?? day.tempMax),
      tempLow: asTemp(day.tempLow ?? day.tempMin)
    }))
  };
};

const weatherIconFor = (condition = "") => {
  const value = condition.toLowerCase();
  if (value.includes("rain")) return <Icon.Rain width="18" height="18" />;
  if (value.includes("mist") || value.includes("fog")) return <Icon.Mist width="18" height="18" />;
  if (value.includes("clear")) return <Icon.Sun width="18" height="18" />;
  if (value.includes("part")) return <Icon.CloudSun width="18" height="18" />;
  return <Icon.Cloud width="18" height="18" />;
};

function IconButton({ icon, label, onClick, ghost = false }) {
  return (
    <button className={ghost ? "icon-btn icon-btn--ghost" : "icon-btn"} aria-label={label} type="button" onClick={onClick}>
      {icon}
    </button>
  );
}

function BottomBar({ activeSheet, onOpenSheet }) {
  return (
    <nav className="bottombar" aria-label="Primary navigation">
      <button className="bottombar__btn bottombar__btn--active" type="button" aria-label="Dashboard">
        <Icon.Sun width="22" height="22" />
      </button>
      <button className={activeSheet === "saved" ? "bottombar__btn bottombar__btn--active" : "bottombar__btn"} type="button" aria-label="Saved places" onClick={() => onOpenSheet("saved")}>
        <Icon.Pin width="22" height="22" />
      </button>
      <button className={activeSheet === "settings" ? "bottombar__btn bottombar__btn--active" : "bottombar__btn"} type="button" aria-label="Settings" onClick={() => onOpenSheet("settings")}>
        <Icon.Settings width="22" height="22" />
      </button>
    </nav>
  );
}

function Sheet({ title, children, onClose }) {
  return (
    <>
      <button className="scrim" aria-label="Close sheet" type="button" onClick={onClose} />
      <section className="sheet" aria-label={title}>
        <div className="sheet__handle" />
        <div className="sheet__head">
          <h2 className="sheet__title">{title}</h2>
          <button className="btn--text" type="button" onClick={onClose}>Done</button>
        </div>
        {children}
      </section>
    </>
  );
}

function Hero({ weather }) {
  const location = weather.location;
  const current = weather.current;

  return (
    <section className="hero" aria-label="Current weather">
      <div className="hero__loc">
        <Icon.Pin width="13" height="13" />
        {location.name}, {location.state || location.country}
      </div>
      <div className="hero__date">Today · {formatDateLabel(current.time)}</div>
      <div className="hero__temp">{asTemp(current.temperature)}<sup>°</sup></div>
      <div className="hero__summary">
        {weatherIconFor(current.condition || current.description)}
        {current.description || current.condition}
      </div>
      <div className="hero__range">
        <span>Feels <strong>{asTemp(current.feelsLike)}°</strong></span>
        <span aria-hidden="true">·</span>
        <span>H <strong>{asTemp(current.tempHigh ?? current.tempMax)}°</strong></span>
        <span>L <strong>{asTemp(current.tempLow ?? current.tempMin)}°</strong></span>
      </div>
    </section>
  );
}

function DetailRow({ current, units }) {
  const items = [
    { label: "Humidity", value: `${current.humidity ?? "--"}%`, icon: <Icon.Drop width="18" height="18" /> },
    { label: "Wind", value: formatWindSpeed(current.windSpeed, units), icon: <Icon.Wind width="18" height="18" /> },
    { label: "Visibility", value: formatVisibility(current.visibility, units), icon: <Icon.Eye width="18" height="18" /> }
  ];

  return (
    <section className="detail-row" aria-label="Weather details">
      {items.map((item) => (
        <article className="detail-row__cell" key={item.label}>
          <div className="detail-row__icon">{item.icon}</div>
          <div className="detail-row__value">{item.value}</div>
          <div className="detail-row__label">{item.label}</div>
        </article>
      ))}
    </section>
  );
}

function tempBucket(temp) {
  if (temp < 40) return "cool";
  if (temp < 55) return "mid";
  if (temp < 70) return "warm";
  return "hot";
}

function ForecastStrip({ hours }) {
  return (
    <section className="fstrip" aria-label="Hourly forecast">
      <div className="fstrip__head">
        <span className="fstrip__title">Hourly</span>
        <span className="fstrip__hint">Swipe</span>
      </div>
      <div className="fstrip__scroll">
        {hours.map((hour, index) => (
          <article className={index === 0 ? "hour hour--now" : "hour"} key={hour.id}>
            <div className="hour__time">{index === 0 ? "Now" : hour.time}</div>
            <div className={`hour__dot hour__dot--${tempBucket(hour.temperature)}`} />
            <div className="hour__temp">{asTemp(hour.temperature)}°</div>
          </article>
        ))}
      </div>
    </section>
  );
}

function FiveDay({ days }) {
  const max = Math.max(...days.map((day) => Number(day.tempHigh ?? day.tempMax)));
  const min = Math.min(...days.map((day) => Number(day.tempLow ?? day.tempMin)));
  const span = max - min || 1;

  return (
    <section className="fivecard" aria-label="Five day forecast">
      {days.map((day) => {
        const tempLow = day.tempLow ?? day.tempMin;
        const tempHigh = day.tempHigh ?? day.tempMax;
        const left = ((Number(tempLow) - min) / span) * 100;
        const width = ((Number(tempHigh) - Number(tempLow)) / span) * 100;
        return (
          <article className="fiverow" key={day.id}>
            <div className="fiverow__day">{day.date}</div>
            <div className="fiverow__icon">{weatherIconFor(day.condition)}</div>
            <div className="fiverow__bar"><i style={{ left: `${left}%`, width: `${Math.max(8, width)}%` }} /></div>
            <div className="fiverow__temps"><em>{tempLow}°</em><strong>{tempHigh}°</strong></div>
          </article>
        );
      })}
    </section>
  );
}

function SavedLocationsSheet({ currentId, error, locations, onAddLocation, onClose, onDelete, onPick }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [locationType, setLocationType] = useState("city");
  const [isSearching, setIsSearching] = useState(false);
  const [message, setMessage] = useState("");

  const handleSearch = async (event) => {
    event.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setMessage("");
    try {
      const matches = await searchLocations(query.trim());
      setResults(matches);
      if (!matches.length) setMessage("No matching cities found.");
    } catch (searchError) {
      setMessage(searchError.message);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSave = async (result) => {
    try {
      await onAddLocation({
        ...result,
        locationType
      });
      setResults([]);
      setQuery("");
    } catch (saveError) {
      setMessage(saveError.message);
    }
  };

  return (
    <Sheet title="Saved places" onClose={onClose}>
      <form className="place-search" onSubmit={handleSearch}>
        <label className="sr-only" htmlFor="place-query">Search city</label>
        <input id="place-query" className="input" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search city" />
        <button className="btn btn--ghost" type="submit"><Icon.Search width="18" height="18" /> {isSearching ? "Searching" : "Search"}</button>
      </form>
      <div className="location-type-picker" aria-label="Environment type">
        {LOCATION_TYPES.map((type) => (
          <button
            key={type.value}
            type="button"
            className={locationType === type.value ? "is-on" : ""}
            onClick={() => setLocationType(type.value)}
          >
            {type.label}
          </button>
        ))}
      </div>
      {message && <p className="sheet-message">{message}</p>}
      {error && <p className="sheet-message sheet-message--error">{error}</p>}
      {results.map((result) => (
        <article className="savecard savecard--result" key={result.id}>
          <div>
            <div className="savecard__name">{result.name}</div>
            <div className="savecard__sub"><Icon.Pin width="12" height="12" />{result.state || "Nearby"} · {result.country}</div>
          </div>
          <button className="savecard__add" type="button" onClick={() => handleSave(result)}>Save</button>
        </article>
      ))}
      {locations.map((place) => (
        <article className={place.id === currentId ? "savecard savecard--current" : "savecard"} key={place.id}>
          <button className="savecard__body" type="button" onClick={() => onPick(place.id)}>
            <span className="savecard__name">{place.name}</span>
            <span className="savecard__sub"><Icon.Pin width="12" height="12" />{place.state || place.country} · {place.locationType || "city"} · {place.condition || "Saved"}</span>
          </button>
          <div className="savecard__temp">{place.temperature ? `${asTemp(place.temperature)}°` : ""}</div>
          <button className="savecard__del" type="button" aria-label={`Delete ${place.name}`} onClick={() => onDelete(place.id)}>
            <Icon.Trash width="16" height="16" />
          </button>
        </article>
      ))}
    </Sheet>
  );
}

function SettingsSheet({ onChange, onClose, onLogout, settings }) {
  const segmentButton = (label, value, current, key) => (
    <button type="button" className={current === value ? "is-on" : ""} onClick={() => onChange({ [key]: value })}>{label}</button>
  );

  return (
    <Sheet title="Settings" onClose={onClose}>
      <div className="setrow">
        <div className="setrow__icon"><Icon.Sun width="18" height="18" /></div>
        <div>
          <div className="setrow__label">Temperature</div>
          <div className="setrow__sub">Imperial or metric</div>
        </div>
        <div className="segment">
          {segmentButton("°F", "imperial", settings.temperatureUnit, "temperatureUnit")}
          {segmentButton("°C", "metric", settings.temperatureUnit, "temperatureUnit")}
        </div>
      </div>
      <div className="setrow">
        <div className="setrow__icon"><Icon.Compass width="18" height="18" /></div>
        <div>
          <div className="setrow__label">Measurements</div>
          <div className="setrow__sub">mph and inches, or km/h and cm</div>
        </div>
        <div className="segment">
          {segmentButton("US", "us", settings.measurementSystem, "measurementSystem")}
          {segmentButton("Metric", "metric", settings.measurementSystem, "measurementSystem")}
        </div>
      </div>
      <div className="setrow">
        <div className="setrow__icon"><Icon.Moon width="18" height="18" /></div>
        <div>
          <div className="setrow__label">Theme</div>
          <div className="setrow__sub">Follows the sky by default</div>
        </div>
        <div className="segment segment--stack">
          {segmentButton("Dynamic", "dynamic", settings.themeMode, "themeMode")}
          {segmentButton("Light", "light", settings.themeMode, "themeMode")}
          {segmentButton("Dark", "dark", settings.themeMode, "themeMode")}
        </div>
      </div>
      <button className="setrow setrow--button" type="button">
        <div className="setrow__icon"><Icon.User width="18" height="18" /></div>
        <div>
          <div className="setrow__label">Account</div>
          <div className="setrow__sub">Manage your Tonal profile</div>
        </div>
        <Icon.ChevR width="18" height="18" />
      </button>
      <button className="btn btn--ghost logout-button" type="button" onClick={onLogout}><Icon.Logout width="18" height="18" /> Log out</button>
    </Sheet>
  );
}

function DashboardScreen({ dashboard, error, isLoading, onAddLocation, onDeleteLocation, onLogout, onSelectLocation, onUpdateSettings }) {
  const [activeSheet, setActiveSheet] = useState(null);
  const weather = normalizeWeather(dashboard.weather, dashboard.selectedLocation);
  const settings = dashboard.settings || mockSettings;
  const savedLocations = dashboard.savedLocations || [];
  const units = weather.meta?.units || settings.temperatureUnit;
  const backgroundLocation = normalizeLocationType(
    dashboard.selectedLocation?.locationType || weather.location?.locationType
  );
  const backgroundWeather = normalizeWeatherCondition(
    weather.current?.condition || weather.current?.description
  );
  const backgroundTime = getTimeOfDay(
    weather.location?.timezoneOffset,
    weather.current?.time
  );

  const enrichedLocations = savedLocations.map((location) => ({
    ...location,
    temperature: location.id === dashboard.selectedLocation?.id ? weather.current.temperature : location.temperature,
    condition: location.id === dashboard.selectedLocation?.id ? weather.current.condition : location.condition
  }));

  return (
    <main className="app-shell">
      <section className="app-surface" aria-label="Tonal weather app">
        <Background location={backgroundLocation} time={backgroundTime} weather={backgroundWeather} />
        <div className="dashboard-scroll">
          <div className="dashboard-top">
            <IconButton label="Saved places" icon={<Icon.Pin width="20" height="20" />} onClick={() => setActiveSheet("saved")} />
            <IconButton label="Settings" icon={<Icon.Menu width="20" height="20" />} onClick={() => setActiveSheet("settings")} />
          </div>
          {isLoading && <div className="status-chip">Refreshing weather</div>}
          {error && <div className="status-chip status-chip--error">{error}</div>}
          {!dashboard.selectedLocation && (
            <section className="empty-location glass glass--strong">
              <h1>No Location Yet</h1>
              <p>Add a saved city to begin drawing the weather around you.</p>
              <button className="btn btn--primary" type="button" onClick={() => setActiveSheet("saved")}>Add a place</button>
            </section>
          )}
          {dashboard.selectedLocation && (
            <>
              <Hero weather={weather} />
              <DetailRow current={weather.current} units={units} />
              <ForecastStrip hours={weather.hourly} />
              <div className="section-label">
                <span>5-day forecast</span>
                <span>{weather.location.name}</span>
              </div>
              <FiveDay days={weather.daily} />
              <div className="section-label">
                <span>Sun</span>
                <span>{weather.current.clouds ?? 100}% cloud cover</span>
              </div>
              <div className="sun-grid">
                <article className="sun-card">
                  <div className="t-meta"><Icon.Sunrise width="14" height="14" /> Sunrise</div>
                  <strong>{weather.current.sunrise}</strong>
                </article>
                <article className="sun-card">
                  <div className="t-meta"><Icon.Sunset width="14" height="14" /> Sunset</div>
                  <strong>{weather.current.sunset}</strong>
                </article>
              </div>
            </>
          )}
        </div>
        <BottomBar activeSheet={activeSheet} onOpenSheet={setActiveSheet} />
        {activeSheet === "saved" && (
          <SavedLocationsSheet
            currentId={dashboard.selectedLocation?.id}
            error={error}
            locations={enrichedLocations}
            onAddLocation={async (location) => {
              await onAddLocation(location);
            }}
            onClose={() => setActiveSheet(null)}
            onDelete={async (id) => {
              await onDeleteLocation(id);
            }}
            onPick={async (id) => {
              await onSelectLocation(id);
              setActiveSheet(null);
            }}
          />
        )}
        {activeSheet === "settings" && (
          <SettingsSheet
            onChange={onUpdateSettings}
            onClose={() => setActiveSheet(null)}
            onLogout={onLogout}
            settings={settings}
          />
        )}
      </section>
    </main>
  );
}

export default function App() {
  const [screen, setScreen] = useState("welcome");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dashboard, setDashboard] = useState(defaultDashboard);
  const [selectedLocationId, setSelectedLocationId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (locationId = selectedLocationId) => {
    setIsLoading(true);
    setError("");
    try {
      const data = await getDashboard(locationId);
      setDashboard({
        settings: data.settings || mockSettings,
        savedLocations: data.savedLocations || [],
        selectedLocation: data.selectedLocation,
        weather: data.weather
      });
      setSelectedLocationId(data.selectedLocation?.id || locationId || null);
    } catch (loadError) {
      setError("Weather data is unavailable right now.");
      setDashboard((current) => current || defaultDashboard);
    } finally {
      setIsLoading(false);
    }
  }, [selectedLocationId]);

  useEffect(() => {
    if (isAuthenticated) {
      loadDashboard();
    }
  }, [isAuthenticated, loadDashboard]);

  const handleAuthenticated = () => {
    setIsAuthenticated(true);
    setScreen("dashboard");
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setScreen("welcome");
  };

  const handleAddLocation = async (location) => {
    try {
      setError("");
      const response = await addLocation({
        name: location.name,
        state: location.state,
        country: location.country,
        lat: location.lat,
        lon: location.lon,
        locationType: normalizeLocationType(location.locationType)
      });
      setSelectedLocationId(response.location.id);
      await updateSettings({ defaultLocationId: response.location.id });
      await loadDashboard(response.location.id);
    } catch (actionError) {
      setError(actionError.message);
      throw actionError;
    }
  };

  const handleDeleteLocation = async (id) => {
    try {
      setError("");
      await deleteLocation(id);
      if (selectedLocationId === id || dashboard.selectedLocation?.id === id) {
        setSelectedLocationId(null);
        await updateSettings({ defaultLocationId: null });
        await loadDashboard(null);
        return;
      }
      await loadDashboard(selectedLocationId);
    } catch (actionError) {
      setError(actionError.message);
    }
  };

  const handleSelectLocation = async (id) => {
    try {
      setError("");
      setSelectedLocationId(id);
      await updateSettings({ defaultLocationId: id });
      await loadDashboard(id);
    } catch (actionError) {
      setError(actionError.message);
    }
  };

  const handleUpdateSettings = async (patch) => {
    try {
      setError("");
      const nextSettings = await updateSettings(patch);
      setDashboard((current) => ({
        ...current,
        settings: nextSettings
      }));
      if (patch.temperatureUnit) {
        await loadDashboard(selectedLocationId);
      }
    } catch (actionError) {
      setError(actionError.message);
    }
  };

  const authActions = useMemo(() => ({
    onSignIn: () => setScreen("signin"),
    onSignUp: () => setScreen("signup"),
    onContinue: handleAuthenticated,
    onLocation: () => setScreen("location")
  }), []);

  if (screen === "signin") {
    return <SignInScreen onContinue={handleAuthenticated} onSignUp={() => setScreen("signup")} />;
  }

  if (screen === "signup") {
    return <SignUpScreen onContinue={handleAuthenticated} onSignIn={() => setScreen("signin")} />;
  }

  if (screen === "location") {
    return <LocationConsentScreen onAllow={handleAuthenticated} onChoose={handleAuthenticated} />;
  }

  if (!isAuthenticated || screen === "welcome") {
    return <WelcomeScreen onContinue={() => setScreen("signup")} onSignIn={authActions.onSignIn} />;
  }

  return (
    <DashboardScreen
      dashboard={dashboard}
      error={error}
      isLoading={isLoading}
      onAddLocation={handleAddLocation}
      onDeleteLocation={handleDeleteLocation}
      onLogout={handleLogout}
      onSelectLocation={handleSelectLocation}
      onUpdateSettings={handleUpdateSettings}
    />
  );
}
