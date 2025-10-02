import React, { useState } from "react";
import axios from "axios";

function App() {
  const [location, setLocation] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (loc) => {
    setLoading(true);
    setError("");
    setWeather(null);
    try {
      const response = await axios.post("http://localhost:5000/api/requests", {
        location: loc,
      });
      setWeather(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.error || "Could not fetch weather. Make sure backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!location) return;
    fetchWeather(location);
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude},${pos.coords.longitude}`;
        fetchWeather(coords);
      },
      (err) => {
        alert("Unable to get your location: " + err.message);
      }
    );
  };

  const handleExportCSV = () => {
    if (!weather || !weather.weather_readings || weather.weather_readings.length === 0) {
      alert("No weather data to export!");
      return;
    }

    const headers = ["timestamp", "temp", "feels_like", "humidity", "pressure", "weather_main", "weather_description", "wind_speed"];
    const rows = weather.weather_readings.map(r => [
      new Date(r.timestamp).toLocaleString(),
      r.temp,
      r.feels_like,
      r.humidity,
      r.pressure,
      r.weather_main,
      r.weather_description,
      r.wind_speed
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(r => r.join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${weather.location_name}_weather.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div style={{ maxWidth: "650px", margin: "0 auto", padding: "20px", fontFamily: "Arial", background: "linear-gradient(to bottom, #f0f8ff, #dbefff)", borderRadius: "10px", boxShadow: "0 0 15px rgba(0,0,0,0.2)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1 style={{ color: "#1e3a8a" }}>Weather App - Visista Varshe</h1>
        <button
          style={{ background: "#facc15", border: "none", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
          onClick={() => window.open("https://www.linkedin.com/company/pm-accelerator/", "_blank")}
        >
          ℹ️ Info
        </button>
      </div>

      <form onSubmit={handleSubmit} style={{ marginTop: "20px", display: "flex", gap: "8px" }}>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Enter city, zip code, GPS..."
          style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #ccc" }}
        />
        <button type="submit" style={{ padding: "10px 15px", background: "#3b82f6", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          🌤 Get Weather
        </button>
        <button type="button" onClick={handleCurrentLocation} style={{ padding: "10px 15px", background: "#10b981", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          📍 Current Location
        </button>
        <button type="button" onClick={handleExportCSV} style={{ padding: "10px 15px", background: "#f97316", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" }}>
          📥 Export CSV
        </button>
      </form>

      {loading && <p style={{ color: "#2563eb", fontWeight: "bold" }}>Loading weather data...</p>}
      {error && <p style={{ color: "red", fontWeight: "bold" }}>{error}</p>}

      {weather && (
        <div style={{ marginTop: "25px", textAlign: "center" }}>
          <h2 style={{ color: "#1e40af" }}>Current Weather in {weather.location_name}</h2>

          {weather.weather_readings && weather.weather_readings.length > 0 ? (
            <div style={{ background: "#e0f2fe", padding: "15px", borderRadius: "10px", marginBottom: "20px" }}>
              <p style={{ fontSize: "18px" }}>
                🌡 <span style={{ color: "#ef4444" }}>{weather.weather_readings[0].temp}°C</span> <br />
                🌤 <span style={{ color: "#fbbf24" }}>{weather.weather_readings[0].weather_main}</span> <br />
                💧 <span style={{ color: "#3b82f6" }}>{weather.weather_readings[0].humidity}%</span> <br />
                🌬 <span style={{ color: "#10b981" }}>{weather.weather_readings[0].wind_speed} m/s</span>
              </p>
            </div>
          ) : (
            <p>No weather readings available.</p>
          )}

          {weather.weather_readings && weather.weather_readings.length > 1 && (
            <div>
              <h3 style={{ color: "#1e40af" }}>Forecast:</h3>
              <div style={{ display: "flex", justifyContent: "space-around", flexWrap: "wrap" }}>
                {weather.weather_readings.slice(1, 6).map((r, idx) => (
                  <div key={idx} style={{ background: "#fef3c7", border: "1px solid #fde68a", padding: "10px", borderRadius: "8px", margin: "5px", minWidth: "100px" }}>
                    <p style={{ fontWeight: "bold" }}>{new Date(r.timestamp).toLocaleString()}</p>
                    <p>🌡 {r.temp}°C</p>
                    <p>🌤 {r.weather_main}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
