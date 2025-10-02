const axios = require('axios');

const isLatLon = (s) => {
  return /^\s*-?\d+(\.\d+)?\s*,\s*-?\d+(\.\d+)?\s*$/.test(s);
};

async function geocode(query) {
  // if lat,lon passed, return directly
  if (isLatLon(query)) {
    const [latStr, lonStr] = query.split(',').map(s => s.trim());
    return { lat: parseFloat(latStr), lon: parseFloat(lonStr), display_name: `lat:${latStr},lon:${lonStr}` };
  }
  const url = 'https://nominatim.openstreetmap.org/search';
  const resp = await axios.get(url, {
    params: { q: query, format: 'json', addressdetails: 0, limit: 1 },
    headers: { 'User-Agent': process.env.USER_AGENT || 'weather-app/1.0' }
  });

  if (!resp.data || resp.data.length === 0) throw new Error('Location not found');
  const top = resp.data[0];
  return { lat: parseFloat(top.lat), lon: parseFloat(top.lon), display_name: top.display_name };
}

module.exports = { geocode, isLatLon };
