// import React from "react";
// import "../scss/weather.scss"
// import Sidebar from '../components/Sidebar'
// import { Cloud, Sun, Wind, Droplet, Thermometer, AlertTriangle } from "lucide-react";

// const WeatherDashboard = () => {
//   const forecastData = [
//     { day: "Today", temp: "32°C", status: "Sunny", icon: <Sun />, rain: "0mm" },
//     { day: "Tomorrow", temp: "29°C", status: "Cloudy", icon: <Cloud />, rain: "5mm" },
//     { day: "Thursday", temp: "25°C", status: "Rain", icon: <Cloud />, rain: "15mm" },
//     { day: "Friday", temp: "27°C", status: "Partly Cloudy", icon: <Cloud />, rain: "2mm" },
//     { day: "Saturday", temp: "30°C", status: "Sunny", icon: <Sun />, rain: "0mm" },
//     { day: "Sunday", temp: "31°C", status: "Sunny", icon: <Sun />, rain: "0mm" },
//     { day: "Monday", temp: "28°C", status: "Thunderstorm", icon: <Cloud />, rain: "25mm" },
//   ];

//   return (
  
//    <>
//    <Sidebar/>
//     <div className="weather-dashboard">
//       <header className="weather-header">
//         <h2>Weather Dashboard</h2>
//         <p>Real-time weather data and forecasts for informed farming decisions</p>
//         <div className="location-search">
//           <input type="text" placeholder="Search location..." defaultValue="Pune, Maharashtra" />
//           <button>🔍</button>
//         </div>
//       </header>

//       <section className="current-weather">
//         <div className="weather-card">
//           <Thermometer size={24} />
//           <h3>28°C</h3>
//           <p>Partly Cloudy</p>
//         </div>
//         <div className="metrics">
//           <div><Droplet /> 65% Humidity</div>
//           <div><Wind /> 12 km/h Wind</div>
//           <div><Sun /> UV Index: 6</div>
//         </div>
//       </section>

//       <section className="forecast">
//         <h3>7-Day Forecast</h3>
//         <div className="forecast-grid">
//           {forecastData.map((day, index) => (
//             <div className="forecast-card" key={index}>
//               <div className="icon">{day.icon}</div>
//               <h4>{day.day}</h4>
//               <p className="temp">{day.temp}</p>
//               <p className="status">{day.status}</p>
//               <span className="rain">🌧 {day.rain}</span>
//             </div>
//           ))}
//         </div>
//       </section>

//       <section className="alerts">
//         <h3>Farming Alerts & Recommendations</h3>

//         <div className="alert yellow">
//           <AlertTriangle /> <strong>Heavy Rain Expected</strong> – Thursday may see 15mm rainfall. Protect sensitive crops.
//         </div>

//         <div className="alert blue">
//           <AlertTriangle /> <strong>Optimal Irrigation Window</strong> – Low rainfall next 3 days, good time for irrigation.
//         </div>

//         <div className="alert red">
//           <AlertTriangle /> <strong>High UV Index</strong> – UV index at 6. Ensure proper protection during field work.
//         </div>
//       </section>

//       <section className="metrics-summary">
//         <h3>Detailed Metrics</h3>
//         <div className="metrics-boxes">
//           <div className="metric-box"><strong>Visibility</strong><p>8 km</p></div>
//           <div className="metric-box"><strong>Pressure</strong><p>1013 hPa</p></div>
//           <div className="metric-box"><strong>Rainfall Today</strong><p>0 mm</p></div>
//         </div>
//       </section>
//     </div></>
//   );
// };

// export default WeatherDashboard;







import React, { useEffect, useState } from "react";
import axios from "axios";
import "../scss/weather.scss";
import Sidebar from "../components/Sidebar";
import {
  Cloud,
  Sun,
  Wind,
  Droplet,
  Thermometer,
  AlertTriangle,
} from "lucide-react";

const WeatherDashboard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [city, setCity] = useState("kolkata");
  const [query, setQuery] = useState("kolkata");



    const fetchWeather = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("access");
        const res = await axios.get(
          `http://127.0.0.1:8000/api/weather/forecast?city=${city}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setWeather(res.data);

      } catch (err) {
        setError("Failed to fetch weather data");
      } finally {
        setLoading(false);
      }
    };



  useEffect(() => {
    fetchWeather();
  }, [city]);

    const handleSearch = () => {
    if (query.trim()) {
      setCity(query.toLowerCase());
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const getWeatherIcon = (code) => {
    if (code === 1000) return <Sun />;
    return <Cloud />;
  };

  if (loading) return <p className="loading">Loading weather data...</p>;
  if (error) return <p className="error">{error}</p>;
  if (!weather) return null;

  const { current, forecast, location } = weather;

  return (
    <>
      <Sidebar />

      <div className="weather-dashboard">
        {/* HEADER */}
        <header className="weather-header">
          <h2>Weather Dashboard</h2>
          <p>Real-time weather data and forecasts for informed farming decisions</p>

           <div className="location-search">
            <input
              type="text"
              placeholder="Search city..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button onClick={handleSearch}>🔍</button>
          </div>

          <div className="city-name">
            <h4>Showing results for {city}</h4>
          </div>
        </header>

        {/* CURRENT WEATHER */}
        <section className="current-weather">
          <div className="weather-card">
            <Thermometer size={24} />
            <h3>{current.temperature}°C</h3>
            <p>{current.weather}</p>
          </div>

          <div className="metrics">
            <div>
              <Droplet /> {current.humidity}% Humidity
            </div>
            <div>
              <Wind /> {current.wind_speed} m/s Wind
            </div>
            <div>
              <Sun /> UV Index: {current.uv_index}
            </div>
          </div>
        </section>

        {/* FORECAST */}
        <section className="forecast">
          <h3>5-Day Forecast</h3>

          <div className="forecast-grid">
            {forecast.map((day, index) => (
              <div className="forecast-card" key={index}>
                <div className="icon">
                  {getWeatherIcon(day.weather_code)}
                </div>
                <h4>{day.date}</h4>
                <p className="temp">
                  {day.temp_min}°C – {day.temp_max}°C
                </p>
                <p className="status">{day.weather}</p>
                <span className="rain">
                  🌧 {day.precipitation_probability_avg}%
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ALERTS */}
        <section className="alerts">
          <h3>Farming Alerts & Recommendations</h3>

          {/* for high rain probability alert */}
          {forecast[0].precipitation_probability_avg > 50 && (
            <div className="alert yellow">
              <AlertTriangle />
              <strong> Rain Alert</strong> – High chance of rainfall today.
            </div>
          )}

          {/* for high uv index alert */}
          {current.uv_index >= 6 && (
            <div className="alert red">
              <AlertTriangle />
              <strong> High UV Index</strong> – Use protective gear.
            </div>
          )}

          {/* for optimal irrigation window alert */}
          {forecast.every(
            (d) => (d.precipitation_probability_avg ?? 0) <= 5
          ) && (
            <div className="alert blue">
              <AlertTriangle />
              <strong> Optimal Irrigation Window</strong> – No rain expected.
            </div>
          )}


          {/* if no alerts are triggered , this message will be shown */}
          {forecast &&
            forecast[0].precipitation_probability_avg <= 50 &&
            current.uv_index < 6 &&
            !forecast.every(d => d.precipitation_probability_avg === 0) && (
              <div className="alert green">
                <AlertTriangle />
                <strong> Normal Conditions</strong> – No weather warnings for today.
              </div>
          )}

        </section>

        {/* METRICS SUMMARY */}
        <section className="metrics-summary">
          <h3>Detailed Metrics</h3>

          <div className="metrics-boxes">
            <div className="metric-box">
              <strong>Visibility</strong>
              <p>{current.visibility} km</p>
            </div>

            <div className="metric-box">
              <strong>Pressure</strong>
              <p>{current.pressure} hPa</p>
            </div>

            <div className="metric-box">
              <strong>Rainfall Today</strong>
              <p>{current.rain_intensity} mm</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default WeatherDashboard;

