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

// export default WeatherDashboard;                  <--1st version of the code





//2nd version of the code with real api and meant for leaf vine styles

// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import "../scss/weather.scss";
// import Sidebar from "../components/Sidebar";
// import {
//   Cloud,
//   Sun,
//   Wind,
//   Droplet,
//   Thermometer,
//   AlertTriangle,
// } from "lucide-react";

// const WeatherDashboard = () => {
//   const [weather, setWeather] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [city, setCity] = useState("kolkata");
//   const [query, setQuery] = useState("kolkata");



//     const fetchWeather = async () => {
//       setLoading(true);
//       setError("");
//       try {
//         const token = localStorage.getItem("access");
//         const res = await axios.get(
//           `http://127.0.0.1:8000/api/weather/forecast?city=${city}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         setWeather(res.data);

//       } catch (err) {
//         setError("Failed to fetch weather data");
//       } finally {
//         setLoading(false);
//       }
//     };



//   useEffect(() => {
//     fetchWeather();
//   }, [city]);

//     const handleSearch = () => {
//     if (query.trim()) {
//       setCity(query.toLowerCase());
//     }
//   };

//   const handleKeyPress = (e) => {
//     if (e.key === "Enter") {
//       handleSearch();
//     }
//   };

//   const getWeatherIcon = (code) => {
//     if (code === 1000) return <Sun />;
//     return <Cloud />;
//   };

//   if (loading) return <p className="loading">Loading weather data...</p>;
//   if (error) return <p className="error">{error}</p>;
//   if (!weather) return null;

//   const { current, forecast, location } = weather;

//   return (
//     <>
//       <Sidebar />

//       <div className="weather-dashboard">
//         {/* HEADER */}
//         <header className="weather-header">
//           <h2>Weather Dashboard</h2>
//           <p>Real-time weather data and forecasts for informed farming decisions</p>

//            <div className="location-search">
//             <input
//               type="text"
//               placeholder="Search city..."
//               value={query}
//               onChange={(e) => setQuery(e.target.value)}
//               onKeyDown={handleKeyPress}
//             />
//             <button onClick={handleSearch}>🔍</button>
//           </div>

//           <div className="city-name">
//             <h4>Showing results for {city}</h4>
//           </div>
//         </header>

//         {/* CURRENT WEATHER */}
//         <section className="current-weather">
//           <div className="weather-card">
//             <Thermometer size={24} />
//             <h3>{current.temperature}°C</h3>
//             <p>{current.weather}</p>
//           </div>

//           <div className="metrics">
//             <div>
//               <Droplet /> {current.humidity}% Humidity
//             </div>
//             <div>
//               <Wind /> {current.wind_speed} m/s Wind
//             </div>
//             <div>
//               <Sun /> UV Index: {current.uv_index}
//             </div>
//           </div>
//         </section>

//         {/* FORECAST */}
//         <section className="forecast">
//           <h3>5-Day Forecast</h3>

//           <div className="forecast-grid">
//             {forecast.map((day, index) => (
//               <div className="forecast-card" key={index}>
//                 <div className="icon">
//                   {getWeatherIcon(day.weather_code)}
//                 </div>
//                 <h4>{day.date}</h4>
//                 <p className="temp">
//                   {day.temp_min}°C – {day.temp_max}°C
//                 </p>
//                 <p className="status">{day.weather}</p>
//                 <span className="rain">
//                   🌧 {day.precipitation_probability_avg}%
//                 </span>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* ALERTS */}
//         <section className="alerts">
//           <h3>Farming Alerts & Recommendations</h3>

//           {/* for high rain probability alert */}
//           {forecast[0].precipitation_probability_avg > 50 && (
//             <div className="alert yellow">
//               <AlertTriangle />
//               <strong> Rain Alert</strong> – High chance of rainfall today.
//             </div>
//           )}

//           {/* for high uv index alert */}
//           {current.uv_index >= 6 && (
//             <div className="alert red">
//               <AlertTriangle />
//               <strong> High UV Index</strong> – Use protective gear.
//             </div>
//           )}

//           {/* for optimal irrigation window alert */}
//           {forecast.every(
//             (d) => (d.precipitation_probability_avg ?? 0) <= 5
//           ) && (
//             <div className="alert blue">
//               <AlertTriangle />
//               <strong> Optimal Irrigation Window</strong> – No rain expected.
//             </div>
//           )}


//           {/* if no alerts are triggered , this message will be shown */}
//           {forecast &&
//             forecast[0].precipitation_probability_avg <= 50 &&
//             current.uv_index < 6 &&
//             !forecast.every(d => d.precipitation_probability_avg === 0) && (
//               <div className="alert green">
//                 <AlertTriangle />
//                 <strong> Normal Conditions</strong> – No weather warnings for today.
//               </div>
//           )}

//         </section>

//         {/* METRICS SUMMARY */}
//         <section className="metrics-summary">
//           <h3>Detailed Metrics</h3>

//           <div className="metrics-boxes">
//             <div className="metric-box">
//               <strong>Visibility</strong>
//               <p>{current.visibility} km</p>
//             </div>

//             <div className="metric-box">
//               <strong>Pressure</strong>
//               <p>{current.pressure} hPa</p>
//             </div>

//             <div className="metric-box">
//               <strong>Rainfall Today</strong>
//               <p>{current.rain_intensity} mm</p>
//             </div>
//           </div>
//         </section>
//       </div>
//     </>
//   );
// };

// export default WeatherDashboard;






//3rd version of the code with real api and dynamic weather styles
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
  CloudSun,
  Droplets,
  Eye,
  Gauge,
  Search,
  MapPin,
  Calendar,
  TrendingUp,
  CloudRain,
  Snowflake,
  CloudDrizzle,
  CloudFog,
  CloudSnow,
  CloudLightning,
  CheckCircle
} from "lucide-react";

const WeatherDashboard = () => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [city, setCity] = useState("kolkata");
  const [query, setQuery] = useState("kolkata");

const [testMode, setTestMode] = useState(null); 


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

  // const getWeatherIcon = (code) => {
  // if (code === 1000 || code === 1100) return <Sun />;

  // // ☁️ Cloudy
  // if (code === 1102 || code === 1001) return <Cloud />;
  
  // // Partly Cloudy
  // if (code === 1101) return <CloudSun />; 

  // // 🌫 Fog
  // if (code === 2000 || code === 2100) return <CloudFog />;

  // // 🌦 Drizzle
  // if (code === 4000) return <CloudDrizzle />;

  // // 🌧 Rain
  // if (code === 4001 || code === 4200) return <CloudRain />;

  // // 🌧 Heavy Rain (same icon, can customize later)
  // if (code === 4201) return <CloudRain />;

  // // ❄️ Snow
  // if (code === 5000 || code === 5001 || code === 5100) return <Snowflake />;

  // // ⛈ Thunderstorm
  // if (code === 8000) return <CloudLightning />;

  // return <Sun />; // fallback
  // };

const getWeatherIcon = (code) => {
  if (!code) return <Sun />;

  if (code === 1000 || code === 1100) return <Sun />;

  if (code === 1101) return <CloudSun />;

  if (code === 1102 || code === 1001) return <Cloud />;

  if (code === 2000 || code === 2100) return <CloudFog />;

  if (code === 3000 || code === 3001 || code === 3002) return <Wind />;

  if (code === 4000) return <CloudDrizzle />;

  if (code === 4001 || code === 4200 || code === 4201)
    return <CloudRain />;

  if (
    code === 5000 ||
    code === 5001 ||
    code === 5100 ||
    code === 5101
  )
    return <Snowflake />;

  if (
    code === 6000 ||
    code === 6001 ||
    code === 6200 ||
    code === 6201 ||
    code === 7000 ||
    code === 7100 ||
    code === 7101 ||
    code === 7102
  )
    return <CloudSnow />;

  
  if (code === 8000 || code === 8001)
    return <CloudLightning />;

  return <Sun />; // fallback
};



const { current, forecast, location } = weather || {};


// const getWeatherClass = () => {
//   if (!current?.weather) return "default";

//   const condition = current.weather.toLowerCase();

//   if (condition.includes("clear")) return "clear";
//   if (condition.includes("cloud")) return "cloudy";
//   if (condition.includes("rain")) return "rain";
//   if (condition.includes("drizzle")) return "drizzle";
//   if (condition.includes("thunder")) return "thunderstorm";
//   if (condition.includes("snow")) return "snow";
//   if (condition.includes("fog")) return "cloudy";

//   return "sunny"; // fallback looks better than default
// };



const getWeatherClass = () => {
  if (!current?.weather) return "default";

  const condition = current.weather.toLowerCase();

  
  if (condition === "clear") return "clear";
  if (condition.includes("mostly clear")) return "sunny";
  if (condition.includes("partly cloudy")) return "sunny";
  if (condition.includes("cloud")) return "cloudy";
  if (condition.includes("fog")) return "cloudy";
  if (condition.includes("drizzle")) return "rain";
  if (condition.includes("rain")) return "rain";
  if (condition.includes("snow") || condition.includes("flurries"))
    return "snow";

  if (condition.includes("freezing")) return "snow";
  if (condition.includes("ice")) return "snow";
  if (condition.includes("thunder")) return "thunderstorm";
  if (condition.includes("wind")) return "cloudy";

  return "sunny"; // fallback stays bright instead of dull
};




const displayCode = testMode
  ? {
      clear: 1000,
      sunny: 1000,
      cloudy: 1001,
      rain: 4001,
      snow: 5000,
      thunderstorm: 8000,
    }[testMode]
  : current?.weather_code ?? 1000;






if (loading)
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>Fetching latest weather...</p>
    </div>
  );

  if (error)
    return (
      <div className="error">
        <span>⚠️</span>
        {error}
      </div>
    );

  //if (loading) return <p className="loading">Loading weather data...</p>;
 // if (error) return <p className="error">{error}</p>;
  if (!weather) return null;




  return (
    <>
      <Sidebar />

      <div className={`weather-dashboard ${testMode || getWeatherClass()}`}>
    
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


        <div style={{ margin: "1rem 0" }}>
          <button onClick={() => setTestMode("clear")}>Clear</button>
          <button onClick={() => setTestMode("cloudy")}>Cloudy</button>
          <button onClick={() => setTestMode("rain")}>Rain</button>
          <button onClick={() => setTestMode("snow")}>Snow</button>
          <button onClick={() => setTestMode("thunderstorm")}>Storm</button>
          <button onClick={() => setTestMode("sunny")}>Sunny</button>
          <button onClick={() => setTestMode(null)}>Real Data</button>
        </div>





        {/* CURRENT WEATHER */}
        <section className={`current-weather-bg ${testMode || getWeatherClass()}`}>
          <div className="weather-card">
            <div className="left">
              <h2>{location}</h2>
              <h3>{current.temperature}°C</h3>
              <div className="weather-info">
                
                {/* <p className="small-icon">{getWeatherIcon(current.weather_code)}</p> */}
                <p className="small-icon">{getWeatherIcon(displayCode)}</p>
                <p className="weather-text">{current.weather}</p>
              </div>
            </div>

            <div className="right">
              <div className="big-icon">
                {/* {getWeatherIcon(current.weather_code)} */}
                {getWeatherIcon(displayCode)}
              </div>
            </div>
          </div>
        </section>

       <section className="current-weather">
        <h2>Current Conditions</h2>

        <div className="metrics">
          <div className="metric-card">
            <Thermometer />
            <h3>{current.temperature}°C</h3>
            <p>Temperature</p>
          </div>

          <div className="metric-card">
            <Droplet />
            <h3>{current.humidity}%</h3>
            <p>Humidity</p>
          </div>

          <div className="metric-card">
            <Wind />
            <h3>{current.wind_speed}</h3>
            <p>km/h Wind</p>
          </div>

          <div className="metric-card">
            <Sun />
            <h3>{current.uv_index}</h3>
            <p>UV Index</p>
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
                  {day.temp_max}°C 
                </p>
                <p>{day.temp_min}°C</p>
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
            <div className="alert-header">
              <AlertTriangle />
              <h4>Heavy Rain Expected</h4>
            </div>
            <p>
              High chance of rainfall today. Consider protecting sensitive crops.
            </p>
          </div>
        )}

        {/* for optimal irrigation window alert */}
        {forecast.every((d) => (d.precipitation_probability_avg ?? 0) <= 5) && (
          <div className="alert blue">
            <div className="alert-header">
              <Calendar />
              <h4>Optimal Irrigation Window</h4>   
            </div>
            <p>No rain expected. Good time for irrigation.</p>
          </div>
        )}

        {/* for high uv index alert */}
        {current.uv_index >= 6 && (
          <div className="alert red">
            <div className="alert-header">
              <AlertTriangle />
              <h4>High UV Index</h4>            
            </div>
            <p>
              UV index at {current.uv_index}. Ensure proper protection during field
              work.
            </p>
          </div>
        )}

        {/* if no alerts are triggered , this message will be shown */}
        {forecast &&
          forecast[0].precipitation_probability_avg <= 50 &&
          current.uv_index < 6 &&
          !forecast.every(d => d.precipitation_probability_avg === 0) && (
            <div className="alert green">
              <div className="alert-header">
                <CheckCircle />
                <h4>Normal Conditions</h4>
              </div>
              <p>No significant weather risks today. Safe for regular farming activities.</p>
            </div>
        )}
          
      </section>

        {/* METRICS SUMMARY */}
        <section className="metrics-summary">
          <h3>Detailed Metrics</h3>

          <div className="metrics-boxes">
            <div className="metric-box">
              <div className="metric-header">
                <Eye />
                <span>Visibility</span>
              </div>
              <h2>{current.visibility} km</h2>
              <p>Clear visibility for field operations</p>
            </div>

            <div className="metric-box">
              <div className="metric-header">
                <Gauge />
                <span>Atmospheric Pressure</span>
              </div>
              <h2>{current.pressure}</h2>
              <p>hPa - Stable conditions</p>
            </div>

            <div className="metric-box">
              <div className="metric-header">
                <CloudRain />
                <span>Rainfall Today</span>
              </div>
              <h2>{current.rain_intensity} mm</h2>
              <p>No irrigation needed</p>
            </div>
          </div>
        </section>



      </div>
    </>
  );
};

export default WeatherDashboard;





