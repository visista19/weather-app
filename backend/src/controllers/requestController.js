const { geocode } = require('../services/geocode');
const { fetchCurrent, fetchForecast } = require('../services/weather');
const Request = require('../models/Request');
const { parseISO, isValid, isAfter, differenceInCalendarDays, startOfDay, endOfDay } = require('date-fns');
const { Parser } = require('json2csv');

function parseDateOrNull(s) {
  if (!s) return null;
  const d = parseISO(s);
  return isValid(d) ? d : null;
}

// ---------------- CREATE -----------------
exports.createRequest = async (req, res) => {
  try {
    const { location, unit = 'metric', start_date, end_date } = req.body;
    if (!location) return res.status(400).json({ error: 'location required' });

    const start = parseDateOrNull(start_date) || new Date();
    const end = parseDateOrNull(end_date) || new Date();

    if (isAfter(start, end)) return res.status(400).json({ error: 'start_date must be <= end_date' });
    const diffDays = Math.abs(differenceInCalendarDays(end, start));
    if (diffDays > 6) {
      return res.status(400).json({ error: 'Date range too large — max 6 days for demo (forecast coverage)' });
    }

    // geocode
    const geo = await geocode(location);
    const lat = geo.lat, lon = geo.lon;

    // fetch current + forecast
    const [curr, forecast] = await Promise.all([
      fetchCurrent(lat, lon, unit).catch(() => null),
      fetchForecast(lat, lon, unit).catch(() => null)
    ]);

    // Build readings
    const readings = [];
    if (curr) {
      readings.push({
        timestamp: new Date(),
        temp: curr.main.temp,
        feels_like: curr.main.feels_like,
        humidity: curr.main.humidity,
        pressure: curr.main.pressure,
        weather_main: curr.weather[0].main,
        weather_description: curr.weather[0].description,
        wind_speed: curr.wind?.speed,
        raw_json: curr
      });
    }

    if (forecast && Array.isArray(forecast.list)) {
      const s = startOfDay(start);
      const e = endOfDay(end);
      for (const item of forecast.list) {
        const ts = new Date(item.dt * 1000);
        if (ts >= s && ts <= e) {
          readings.push({
            timestamp: ts,
            temp: item.main.temp,
            feels_like: item.main.feels_like,
            humidity: item.main.humidity,
            pressure: item.main.pressure,
            weather_main: item.weather[0].main,
            weather_description: item.weather[0].description,
            wind_speed: item.wind?.speed,
            raw_json: item
          });
        }
      }
    }

    const doc = await Request.create({
      location_name: location,
      normalized_name: geo.display_name,
      lat, lon,
      unit,
      start_date: start,
      end_date: end,
      weather_readings: readings
    });

    return res.status(201).json(doc);
  } catch (err) {
  console.error("---- ERROR in createRequest ----");
  console.error(err);              // full object
  console.error(err.stack);        // stack trace
  console.error("---- END ERROR ----");

  return res.status(500).json({ error: err.message || 'server error' });
}
};

// ---------------- LIST -----------------
exports.listRequests = async (req, res) => {
  const docs = await Request.find().sort({ created_at: -1 }).limit(100);
  res.json(docs);
};

// ---------------- GET BY ID -----------------
exports.getRequest = async (req, res) => {
  try {
    const doc = await Request.findById(req.params.id);
    if (!doc) return res.status(404).json({ error: 'not found' });
    res.json(doc);
  } catch (err) {
    return res.status(400).json({ error: 'invalid id format' });
  }
};

// ---------------- GET BY LOCATION -----------------
exports.getWeatherByLocation = async (req, res) => {
  try {
    const location = req.query.location;
    if (!location) return res.status(400).json({ error: 'Location is required' });

    // Try to find existing request
    let doc = await Request.findOne({ location_name: location });

    if (!doc) {
      // auto-create if not in DB
      req.body = { location };
      return exports.createRequest(req, res);
    }

    return res.json(doc);
  } catch (err) {
    console.error(err.message || err);
    return res.status(500).json({ error: err.message || 'server error' });
  }
};

// ---------------- UPDATE -----------------
exports.updateRequest = async (req, res) => {
  const { location, start_date, end_date, unit } = req.body;
  const update = {};
  if (location) {
    const geo = await geocode(location);
    update.location_name = location;
    update.normalized_name = geo.display_name;
    update.lat = geo.lat;
    update.lon = geo.lon;
  }
  if (unit) update.unit = unit;
  if (start_date) update.start_date = parseDateOrNull(start_date);
  if (end_date) update.end_date = parseDateOrNull(end_date);

  const updated = await Request.findByIdAndUpdate(req.params.id, update, { new: true });
  res.json(updated);
};

// ---------------- DELETE -----------------
exports.deleteRequest = async (req, res) => {
  await Request.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};

// ---------------- EXPORT -----------------
exports.exportRequest = async (req, res) => {
  const id = req.params.id;
  const format = (req.query.format || 'json').toLowerCase();
  const doc = await Request.findById(id);
  if (!doc) return res.status(404).json({ error: 'not found' });

  if (format === 'json') {
    return res.json(doc);
  } else if (format === 'csv') {
    const rows = doc.weather_readings.map(r => ({
      timestamp: r.timestamp,
      temp: r.temp,
      feels_like: r.feels_like,
      humidity: r.humidity,
      pressure: r.pressure,
      weather_main: r.weather_main,
      weather_description: r.weather_description,
      wind_speed: r.wind_speed
    }));
    const parser = new Parser();
    const csv = parser.parse(rows);
    res.header('Content-Type', 'text/csv');
    res.attachment(`${id}.csv`).send(csv);
  } else {
    return res.status(400).json({ error: 'unsupported format' });
  }
};
