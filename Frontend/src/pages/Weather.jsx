import React from "react";
import "../scss/weather.scss"
import Sidebar from '../components/Sidebar'
import { Cloud, Sun, Wind, Droplet, Thermometer, AlertTriangle } from "lucide-react";

const WeatherDashboard = () => {
  const forecastData = [
    { day: "Today", temp: "32°C", status: "Sunny", icon: <Sun />, rain: "0mm" },
    { day: "Tomorrow", temp: "29°C", status: "Cloudy", icon: <Cloud />, rain: "5mm" },
    { day: "Thursday", temp: "25°C", status: "Rain", icon: <Cloud />, rain: "15mm" },
    { day: "Friday", temp: "27°C", status: "Partly Cloudy", icon: <Cloud />, rain: "2mm" },
    { day: "Saturday", temp: "30°C", status: "Sunny", icon: <Sun />, rain: "0mm" },
    { day: "Sunday", temp: "31°C", status: "Sunny", icon: <Sun />, rain: "0mm" },
    { day: "Monday", temp: "28°C", status: "Thunderstorm", icon: <Cloud />, rain: "25mm" },
  ];

  return (
  
   <>
   <Sidebar/>
    <div className="weather-dashboard">
      <header className="weather-header">
        <h2>Weather Dashboard</h2>
        <p>Real-time weather data and forecasts for informed farming decisions</p>
        <div className="location-search">
          <input type="text" placeholder="Search location..." defaultValue="Pune, Maharashtra" />
          <button>🔍</button>
        </div>
      </header>

      <section className="current-weather">
        <div className="weather-card">
          <Thermometer size={24} />
          <h3>28°C</h3>
          <p>Partly Cloudy</p>
        </div>
        <div className="metrics">
          <div><Droplet /> 65% Humidity</div>
          <div><Wind /> 12 km/h Wind</div>
          <div><Sun /> UV Index: 6</div>
        </div>
      </section>

      <section className="forecast">
        <h3>7-Day Forecast</h3>
        <div className="forecast-grid">
          {forecastData.map((day, index) => (
            <div className="forecast-card" key={index}>
              <div className="icon">{day.icon}</div>
              <h4>{day.day}</h4>
              <p className="temp">{day.temp}</p>
              <p className="status">{day.status}</p>
              <span className="rain">🌧 {day.rain}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="alerts">
        <h3>Farming Alerts & Recommendations</h3>

        <div className="alert yellow">
          <AlertTriangle /> <strong>Heavy Rain Expected</strong> – Thursday may see 15mm rainfall. Protect sensitive crops.
        </div>

        <div className="alert blue">
          <AlertTriangle /> <strong>Optimal Irrigation Window</strong> – Low rainfall next 3 days, good time for irrigation.
        </div>

        <div className="alert red">
          <AlertTriangle /> <strong>High UV Index</strong> – UV index at 6. Ensure proper protection during field work.
        </div>
      </section>

      <section className="metrics-summary">
        <h3>Detailed Metrics</h3>
        <div className="metrics-boxes">
          <div className="metric-box"><strong>Visibility</strong><p>8 km</p></div>
          <div className="metric-box"><strong>Pressure</strong><p>1013 hPa</p></div>
          <div className="metric-box"><strong>Rainfall Today</strong><p>0 mm</p></div>
        </div>
      </section>
    </div></>
  );
};

export default WeatherDashboard;
