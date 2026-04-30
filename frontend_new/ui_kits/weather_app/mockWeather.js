const mockWeather = {
  location: {
    id: "newark-nj",
    name: "Newark",
    state: "New Jersey",
    country: "US",
    lat: 40.7357,
    lon: -74.1724
  },
  current: {
    time: "8:00 PM",
    temperature: 52,
    feelsLike: 50,
    tempMin: 49,
    tempMax: 55,
    condition: "Cloudy",
    description: "Overcast clouds",
    icon: "cloudy",
    humidity: 81,
    pressure: 1016,
    visibility: "10 mi",
    windSpeed: "10 mph",
    windDirection: 230,
    clouds: 100,
    sunrise: "6:20 AM",
    sunset: "7:42 PM"
  },
  hourly: [
    { id: "8pm", time: "8 PM", temperature: 52, condition: "Cloudy", description: "Cloudy", icon: "cloudy", feelsLike: 50, precipitationChance: 12, humidity: 81, windSpeed: "10 mph" },
    { id: "11pm", time: "11 PM", temperature: 50, condition: "Cloudy", description: "Cloudy", icon: "cloudy", feelsLike: 48, precipitationChance: 18, humidity: 84, windSpeed: "9 mph" },
    { id: "2am", time: "2 AM", temperature: 48, condition: "Mist", description: "Mist", icon: "mist", feelsLike: 46, precipitationChance: 24, humidity: 88, windSpeed: "7 mph" },
    { id: "5am", time: "5 AM", temperature: 47, condition: "Cloudy", description: "Cloudy", icon: "cloudy", feelsLike: 45, precipitationChance: 15, humidity: 86, windSpeed: "6 mph" },
    { id: "8am", time: "8 AM", temperature: 51, condition: "Partly cloudy", description: "Partly cloudy", icon: "partly", feelsLike: 50, precipitationChance: 8, humidity: 78, windSpeed: "8 mph" }
  ],
  daily: [
    { id: "today", date: "Today", tempMax: 55, tempMin: 49, condition: "Cloudy", description: "Cloudy", icon: "cloudy", precipitationChance: 18 },
    { id: "friday", date: "Friday", tempMax: 60, tempMin: 50, condition: "Rain", description: "Rain", icon: "rain", precipitationChance: 70 },
    { id: "saturday", date: "Saturday", tempMax: 64, tempMin: 52, condition: "Partly cloudy", description: "Partly cloudy", icon: "partly", precipitationChance: 20 },
    { id: "sunday", date: "Sunday", tempMax: 58, tempMin: 47, condition: "Clear", description: "Clear", icon: "clear", precipitationChance: 5 },
    { id: "monday", date: "Monday", tempMax: 62, tempMin: 51, condition: "Cloudy", description: "Cloudy", icon: "cloudy", precipitationChance: 15 }
  ],
  alerts: []
};

const mockSavedLocations = [
  { id: "newark-nj", name: "Newark", state: "New Jersey", temperature: 52, condition: "Cloudy" },
  { id: "new-york-ny", name: "New York", state: "New York", temperature: 54, condition: "Rain" },
  { id: "jersey-city-nj", name: "Jersey City", state: "New Jersey", temperature: 53, condition: "Cloudy" },
  { id: "montclair-nj", name: "Montclair", state: "New Jersey", temperature: 50, condition: "Mist" }
];

const mockSettings = {
  temperatureUnit: "imperial",
  measurementSystem: "us",
  themeMode: "dynamic",
  defaultLocationId: "newark-nj"
};

window.mockWeather = mockWeather;
window.mockSavedLocations = mockSavedLocations;
window.mockSettings = mockSettings;
