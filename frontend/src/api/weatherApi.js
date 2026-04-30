const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || "").replace(/\/$/, "");

const request = async (path, options = {}) => {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers
      },
      ...options
    });
  } catch {
    throw new Error("Backend weather service is unavailable.");
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || "Request failed.");
  }

  return data;
};

export const getDashboard = (locationId) => {
  const query = locationId ? `?locationId=${encodeURIComponent(locationId)}` : "";
  return request(`/api/dashboard${query}`);
};

export const getLocations = () => request("/api/locations");

export const addLocation = (location) =>
  request("/api/locations", {
    method: "POST",
    body: JSON.stringify(location)
  });

export const deleteLocation = (id) =>
  request(`/api/locations/${encodeURIComponent(id)}`, {
    method: "DELETE"
  });

export const updateLocation = (id, patch) =>
  request(`/api/locations/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(patch)
  });

export const searchLocations = (query) =>
  request(`/api/geocode/search?query=${encodeURIComponent(query)}`);

export const updateSettings = (settings) =>
  request("/api/settings", {
    method: "PATCH",
    body: JSON.stringify(settings)
  });
