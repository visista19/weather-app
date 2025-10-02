const axios = require('axios');

const OWM_KEY = process.env.OWM_KEY;
if (!OWM_KEY) console.warn('⚠️  OWM_KEY not set in env');

async function fetchCurrent(lat, lon, units = 'metric') {
  const url = 'https://api.openweathermap.org/data/2.5/weather';
  const resp = await axios.get(url, { params: { lat, lon, units, appid: OWM_KEY } });
  return resp.data;
}

// 5-day forecast (3-hour steps)
async function fetchForecast(lat, lon, units = 'metric') {
  const url = 'https://api.openweathermap.org/data/2.5/forecast';
  const resp = await axios.get(url, { params: { lat, lon, units, appid: OWM_KEY } });
  return resp.data; // contains list[]
}

module.exports = { fetchCurrent, fetchForecast };
