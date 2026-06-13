
import React, { useState } from "react";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import Sidebar from "../components/Sidebar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid,
  ResponsiveContainer
} from "recharts";

import "../scss/recommendation.scss";

const COLORS = ["#044306", "#ec9f2a", "#0a4676", "#e91058", "#7a058e"];

export default function Recommendation() {
  const token =
  localStorage.getItem("access") ||
  localStorage.getItem("token");

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // FORM DATA
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  // LOCATION STATE
  const [location, setLocation] = useState({
    state: "",
    district: "",
    latitude: "",
    longitude: "",
  });

  // UI STATES
  const [activeTab, setActiveTab] = useState("manual");
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);


  //analysis
  const [aiAnalysis, setAiAnalysis] = useState("");
  const [locationAnalysis, setLocationAnalysis] = useState(null);

  const generateAnalysis = (crop) => {
  return `${crop} is recommended because the current soil nutrient levels, pH balance, temperature, humidity, and rainfall conditions closely match the optimal growth requirements for ${crop}. The recommendation engine found ${crop} to be the most suitable crop among all available options based on the provided environmental and soil parameters.`;
};

const getReasons = () => {
  const reasons = [];

  if (Number(formData.N) > 50)
    reasons.push("Nitrogen level supports healthy vegetative growth.");

  if (Number(formData.P) > 30)
    reasons.push("Phosphorus content promotes strong root development.");

  if (Number(formData.K) > 30)
    reasons.push("Potassium level improves crop productivity and resistance.");

  if (Number(formData.ph) >= 6 && Number(formData.ph) <= 7.5)
    reasons.push("Soil pH is within the optimal range.");

  if (Number(formData.temperature) >= 20 && Number(formData.temperature) <= 35)
    reasons.push("Temperature conditions are favorable.");

  if (Number(formData.humidity) >= 50)
    reasons.push("Humidity level supports crop growth.");

  if (Number(formData.rainfall) >= 50)
    reasons.push("Rainfall availability is sufficient.");

  return reasons;
};

  // FETCH HISTORY
  const fetchHistory = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/history/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401) {
        console.log("Unauthorized");
        return;
      }

      const data = await res.json();
      setHistory(data);
    } catch {
      console.log("Failed to fetch history");
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);

    if (tab === "history") {
      fetchHistory();
    }
  };

  // INPUT CHANGE
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLocationChange = (e) => {
    setLocation({
      ...location,
      [e.target.name]: e.target.value,
    });
  };

  // CLEAR
  const handleClear = () => {
    setFormData({
      N: "",
      P: "",
      K: "",
      temperature: "",
      humidity: "",
      ph: "",
      rainfall: "",
    });

    setLocation({
      state: "",
      district: "",
      latitude: "",
      longitude: "",
    });

    setResult(null);
    setError("");
    setErrorDetails({});
    setChartData([]);
  };

  // FETCH COORDINATES
  const fetchCoordinatesFromAddress = async () => {
    if (!location.state || !location.district) return;

    try {
      const query = `${location.district}, ${location.state}`;

      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${query}`
      );

      const data = await res.json();

      if (data.length === 0) return;

      const place = data[0];

      setLocation((prev) => ({
        ...prev,
        latitude: Number(place.lat).toFixed(4),
        longitude: Number(place.lon).toFixed(4),
      }));
    } catch {
      console.log("Error fetching coordinates");
    }
  };

  // GET CURRENT LOCATION
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
          );

          const data = await res.json();

          setLocation({
            latitude: lat.toFixed(4),
            longitude: lon.toFixed(4),
            state: data.address.state || "",
            district:
              data.address.state_district ||
              data.address.county ||
              data.address.city ||
              data.address.town ||
              data.address.village ||
              "",
          });
        } catch {
          alert("Failed to fetch location details");
        }
      },
      () => alert("Permission denied")
    );
  };

  // MANUAL SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setErrorDetails({});
    setResult(null);
    setChartData([]);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/predict/",
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            N: Number(formData.N),
            P: Number(formData.P),
            K: Number(formData.K),
            temperature: Number(formData.temperature),
            humidity: Number(formData.humidity),
            ph: Number(formData.ph),
            rainfall: Number(formData.rainfall),
          }),
        }
      );

      if (res.status === 401) {
        setError("Unauthorized");
        return;
      }

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid input");
        setErrorDetails(data.errors || {});
        return;
      }

      setResult(data.crops[0]?.name);

      //analysis section added for batter approch
      setAiAnalysis(generateAnalysis(data.crops[0]?.name));

      const maxScore = Math.max(...data.crops.map((c) => c.score));

      setChartData(
        data.crops.map((item) => ({
          name: item.name,
          score: Number(((item.score / maxScore) * 100).toFixed(2)),
        }))
      );
    } catch {
      setError("Server error! Try again.");
    } finally {
      setLoading(false);
    }
  };

  // LOCATION SUBMIT
  const handleLocationSubmit = async () => {
    if (!location.latitude || !location.longitude) {
      alert("Please fetch location first");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);
    setChartData([]);

    try {
      const res = await fetch(
        "http://127.0.0.1:8000/api/predict/location/",
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            latitude: Number(location.latitude),
            longitude: Number(location.longitude),
          }),
        }
      );

      if (res.status === 401) {
        setError("Unauthorized");
        return;
      }

      const data = await res.json();
      console.log(data)
      if (!res.ok) {
        setError(data.message || "Location prediction failed");
        return;
      }

      setResult(data.crop);
      
      //analysis
//       setLocationAnalysis({
//   state: location.state,
//   district: location.district,
//   latitude: location.latitude,
//   longitude: location.longitude,
//   temperature: data.temperature,
//   humidity: data.humidity,
//   rainfall: data.rainfall,


// });

setLocationAnalysis({
  state: location.state,
  district: location.district,
  latitude: location.latitude,
  longitude: location.longitude,

  temperature: data.weather.temperature,
  humidity: data.weather.humidity,
  rainfall: data.weather.rainfall,
});
 
//set ai analysis
setAiAnalysis(
  generateLocationAnalysis(
    data.crop,
    location.district,
    location.state
  )
);
      const maxScore = Math.max(...data.crops.map((c) => c.score));

      setChartData(
        data.crops.map((item) => ({
          name: item.name,
          score: Number(((item.score / maxScore) * 100).toFixed(2)),
        }))
      );
    } catch {
      setError("Server error!");
    } finally {
      setLoading(false);
    }
  };

  //get location wise crop reson
  const getLocationReasons = () => {
  const reasons = [];

  if (!locationAnalysis) return reasons;

  if (locationAnalysis.temperature >= 20 &&
      locationAnalysis.temperature <= 35) {
    reasons.push(
      "Temperature conditions are favorable for crop growth."
    );
  }

  if (locationAnalysis.humidity >= 50) {
    reasons.push(
      "Humidity level supports healthy crop development."
    );
  }

  if (locationAnalysis.rainfall >= 50) {
    reasons.push(
      "Rainfall availability is sufficient for cultivation."
    );
  }

  reasons.push(
    `${result} is suitable for the climatic conditions of ${locationAnalysis.district}.`
  );

  return reasons;
};
const generateLocationAnalysis = (crop, district, state) => {
  return `${crop} is recommended for ${district}, ${state} because the local temperature, humidity, and rainfall conditions closely match the environmental requirements of ${crop}. Based on the weather profile and regional agricultural suitability, ${crop} has the highest recommendation score among all candidate crops.`;
};


  return (
    <>
      <Sidebar />
      {/* your existing JSX remains exactly same */}
             <div className="recommendation-page">
        <h1>🌿 Crop Recommendation</h1>
        <p className="subtitle">
          Get AI-powered crop recommendations based on soil and climate data
        </p>

        {/* 🔹 TABS */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'manual' ? 'active' : ''}`}
            onClick={() => setActiveTab('manual')}
          >
            Manual Input
          </button>

          <button
            className={`tab ${activeTab === 'location' ? 'active' : ''}`}
            onClick={() => setActiveTab('location')}
          >
            By Location
          </button>

          {/* <button className={`tab ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}>History</button> */}

          <button
         className={`tab ${activeTab === 'history' ? 'active' : ''}`}
         onClick={() => handleTabChange('history')}
         >
        History
        </button>
        </div>

        <div className="main-layout">

          {/* 🔹 MANUAL FORM */}
          {activeTab === "manual" && (
            <form onSubmit={handleSubmit} className="form-card">
              <h2>Enter Soil & Climate Data</h2>

              <div className="grid">
                <input type="number" name="N" placeholder="Nitrogen (0-150)" value={formData.N} onChange={handleChange} required />
                <input type="number" name="P" placeholder="Phosphorus (0-150)" value={formData.P} onChange={handleChange} required />
                <input type="number" name="K" placeholder="Potassium (0-210)" value={formData.K} onChange={handleChange} required />
                <input type="number" name="temperature" placeholder="Temperature (0-60°C)" value={formData.temperature} onChange={handleChange} required />
                <input type="number" name="humidity" placeholder="Humidity (0-100%)" value={formData.humidity} onChange={handleChange} required />
                <input type="number" step="0.1" name="ph" placeholder="pH (0-14)" value={formData.ph} onChange={handleChange} required />
              </div>

              <input
                className="full"
                type="number"
                name="rainfall"
                placeholder="Rainfall (mm/month)"
                value={formData.rainfall}
                onChange={handleChange}
                required
              />

              <div className="button-group">
                <button type="submit" className="predict-btn" disabled={loading}>
                  {loading ? "Predicting..." : "🚀 Get Recommendation"}
                </button>
                <button type="button" className="clear-btn" onClick={handleClear}>
                  Clear
                </button>
              </div>
            </form>
          )}

          {/* 🔹 LOCATION FORM */}
          {activeTab === "location" && (
            <div className="form-card">
              <h2> <LocationOnIcon style={{ marginRight: "6px" }} /> Location-Based Prediction</h2>

              <p className="subtitle">
                Weather data will be auto-fetched from your location
              </p>

              <div className="grid">
                {/* STATE */}
    <input
      type="text"
      name="state"
      placeholder="Enter State"
      value={location.state}
      onChange={handleLocationChange} 
      required
    />
                {/* DISTRICT */}
    <input
      type="text"
      name="district"
      placeholder="Enter District"
      value={location.district}
      onChange={handleLocationChange}
      required
    />

      {/* LAT */}
    <input
      type="text"
      placeholder="Latitude"
      value={location.latitude}
      readOnly
      onFocus={fetchCoordinatesFromAddress}
    />

    {/* LON */}
    <input
      type="text"
      placeholder="Longitude"
      value={location.longitude}
      readOnly
      onFocus={fetchCoordinatesFromAddress}
    />
              </div>

              <div className="button-group">

  <button
    type="button"
    className="location-btn"
    onClick={handleGetLocation}
    disabled={loading}
  >
    {loading ? (
      <>
        <span className="spinner"></span>
        Fetching...
      </>
    ) : (
      <>
        <LocationOnIcon className="icon" />
        <span>Use My Location</span>
      </>
    )}
  </button>

  {/* 🔴 NEW CLEAR BUTTON */}
  <button
  type="button"
  className="clear-btn"
  onClick={handleClear}
>
  Clear
</button>

 <button
  type="button"
  className="predict-btn"
  onClick={handleLocationSubmit}
  disabled={loading}
>
  {loading ? "Predicting..." : "🚀 Get Recommendation"}
</button>

</div>
            </div>
          )}

          {activeTab === "history" && (
  <div className="form-card history-card">
    <h2>📜 Prediction History</h2>

    {history.length === 0 ? (
      <div className="empty">
        <h3>No history available</h3>
        <p>Your predictions will appear here</p>
      </div>
    ) : (
      <div className="history-list">
        {history.map((item, index) => (
 
  <div className="history-item" key={index}>

  {/* LEFT */}
  <div className="left">
    <div className="crop">🌱 {item.crop}</div>

    <div className="details">
      N:{item.N} | P:{item.P} | K:{item.K}
    </div>

    <div className="details">
      🌡 {item.temperature}°C | 💧 {item.humidity}%
    </div>
  </div>

  {/* RIGHT */}
  <div className="right">
    <div className="time">
      ⏰ {new Date(item.created_at).toLocaleString("en-IN")}
    </div>

    <div className="badge">
      Prediction
    </div>
  </div>

</div>
        ))}
      </div>
    )}
  </div>
)}

     

          {/* 🔹 RESULT */}
<div className={`result-Card ${error ? "error-card" : ""}`}>

  {error ? (
    <div className="error-box">
      <div className="error-icon">⚠️</div>

      <h2>Invalid Input</h2>

   

      {Object.keys(errorDetails).length > 0 && (
        <ul className="error-list">
          {Object.entries(errorDetails).map(([key, value], i) => (
            <li key={i}>
              <strong>{key}:</strong> {value}
            </li>
          ))}
        </ul>
      )}
    </div>

  ) : !result ? (

    <div className="empty">
      <div className="icon">🤖</div>
      <h3>No prediction yet</h3>
      <p>Enter your data and click "Get Recommendation"</p>
    </div>

  ) : (

    <div className="result">
      <h2>🌱 Top Crop Recommendation</h2>
      <div className="crop-name">{result}</div>

      <div style={{ width: "100%", height: 300 }}>
        <ResponsiveContainer>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(value) => `${value}%`} />

            <Bar dataKey="score">
              {chartData.map((entry, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>

        {/* Soil Summary */}






{activeTab === "manual" ? (
  <>
    {/* Existing Soil Summary */}
    <div className="soil-summary1">
  <h3>📊 Soil & Climate Summary</h3>

  <div className="summary-grid1">
    <div><span>Nitrogen :</span><strong>{formData.N}kg</strong></div>
    <div><span>Phosphorus :</span><strong>{formData.P}kg</strong></div>
    <div><span>Potassium :</span><strong>{formData.K}kg</strong></div>
    <div><span>Temperature :</span><strong>{formData.temperature}°C</strong></div>
    <div><span>Humidity :</span><strong>{formData.humidity}%</strong></div>
    <div><span>pH :</span><strong>{formData.ph}</strong></div>
    <div className="full">
      <span>Rainfall</span>
      <strong>{formData.rainfall} mm</strong>
    </div>
  </div>
</div>

    <div className="crop-reasons">
      <h3>🌱 Why {result}?</h3>

      <ul>
        {getReasons().map((reason, index) => (
          <li key={index}>{reason}</li>
        ))}
      </ul>
    </div>
    <div className="ai-analysis">
  <h3>🤖 AI Analysis</h3>

  <p>{aiAnalysis}</p>
</div>
  </>
) : (
  <>
    {/* Location Summary */}
    <div className="soil-summary1">
      <h3>📍 Location & Climate Summary</h3>

      <div className="summary-grid1">
        <div>
          <span>State :</span>
          <strong>{locationAnalysis?.state}</strong>
        </div>

        <div>
          <span>District :</span>
          <strong>{locationAnalysis?.district}</strong>
        </div>

        <div>
          <span>Latitude :</span>
          <strong>{locationAnalysis?.latitude}</strong>
        </div>

        <div>
          <span>Longitude :</span>
          <strong>{locationAnalysis?.longitude}</strong>
        </div>

        <div>
          <span>Temperature :</span>
          <strong>{locationAnalysis?.temperature}°C</strong>
        </div>

        <div>
          <span>Humidity :</span>
          <strong>{locationAnalysis?.humidity}%</strong>
        </div>

        <div className="full">
          <span>Rainfall :</span>
          <strong>{locationAnalysis?.rainfall} mm</strong>
        </div>
      </div>
    </div>

    <div className="crop-reasons">
      <h3>🌱 Why {result}?</h3>

      <ul>
        {getLocationReasons().map((reason, index) => (
          <li key={index}>{reason}</li>
        ))}
      </ul>
    </div>


  </>
)}



      </div>
    </div>

  )}
</div>

          

        </div>
      </div>


    
    </>
  );
}