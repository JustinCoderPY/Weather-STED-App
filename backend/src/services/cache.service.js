const store = new Map();

const get = (key) => {
  const entry = store.get(key);

  if (!entry) {
    return null;
  }

  if (Date.now() > entry.expiresAt) {
    store.delete(key);
    return null;
  }

  return entry.value;
};

const set = (key, value, ttlSeconds) => {
  store.set(key, {
    value,
    expiresAt: Date.now() + ttlSeconds * 1000
  });
};

const buildKey = (...parts) =>
  parts
    .filter((part) => part !== undefined && part !== null)
    .map((part) => String(part).trim().toLowerCase())
    .join(":");

module.exports = {
  get,
  set,
  buildKey
};
