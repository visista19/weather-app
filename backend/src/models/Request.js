const mongoose = require('mongoose');

const ReadingSchema = new mongoose.Schema({
  timestamp: { type: Date, required: true },
  temp: Number,
  feels_like: Number,
  humidity: Number,
  pressure: Number,
  weather_main: String,
  weather_description: String,
  wind_speed: Number,
  raw_json: Object
});

const RequestSchema = new mongoose.Schema({
  location_name: { type: String, required: true },
  normalized_name: String,
  lat: Number,
  lon: Number,
  unit: { type: String, default: 'metric' },
  start_date: Date,
  end_date: Date,
  weather_readings: [ReadingSchema],
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

RequestSchema.pre('save', function(next){ this.updated_at = new Date(); next(); });

module.exports = mongoose.model('Request', RequestSchema);
