
import React, { useState } from 'react'
import LocationOnIcon from '@mui/icons-material/LocationOn';  // metirial ui
import Sidebar from '../components/Sidebar'
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

import "../scss/recommendation.scss"

const COLORS = ["#044306", "#ec9f2a", "#0a4676", "#e91058", "#7a058e"];

export default function Recommendation() {

  // 🔹 FORM DATA
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  // 🔹 LOCATION STATE
  const [location, setLocation] = useState({
    state: "",
    district: "",
    latitude: "",
    longitude: "",
   
  });

  // 🔹 UI STATES
  const [activeTab, setActiveTab] = useState('manual');
  const [result, setResult] = useState(null);
  const [chartData, setChartData] = useState([]);
  const [error, setError] = useState("");
  const [errorDetails, setErrorDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState([]);


  // history 
  const fetchHistory = async () => {
  try {
    const res = await fetch("http://127.0.0.1:8000/api/history");
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


  // 🔹 INPUT CHANGE
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  //handle location change
  const handleLocationChange = (e) => {
  setLocation({ ...location, [e.target.name]: e.target.value });
};
  // 🔹 CLEAR
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

  // 🔹 GET LOCATION

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
        // Reverse geocoding
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}`
        );

        const data = await res.json();

        setLocation({
          latitude: lat.toFixed(4),
          longitude: lon.toFixed(4),
          state: data.address.state || "",
          district:
            data.address.state_district ||   // ✅ FIXED (important)
            data.address.county ||
            data.address.city ||
            data.address.town ||
            data.address.village ||
            data.address.municipality ||
            ""
        });

      } catch {
        alert("Failed to fetch location details");
      }
    },
    () => {
      alert("Permission denied");
    }
  );
};



  // 🔹 MANUAL SUBMIT (EXISTING API)
  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setErrorDetails({});
    setResult(null);
    setChartData([]);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          N: Number(formData.N),
          P: Number(formData.P),
          K: Number(formData.K),
          temperature: Number(formData.temperature),
          humidity: Number(formData.humidity),
          ph: Number(formData.ph),
          rainfall: Number(formData.rainfall),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Invalid input");
        setErrorDetails(data.errors || {});
        return;
      }

      setResult(data.crops[0]?.name);

      const maxScore = Math.max(...data.crops.map(c => c.score));

      setChartData(
        data.crops.map(item => ({
          name: item.name,
          score: Number(((item.score / maxScore) * 100).toFixed(2))
        }))
      );

    } catch (err) {
      setError("Server error! Try again.");
    } finally {
      setLoading(false);
    }
  };

  // predict by location

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
    const res = await fetch("http://127.0.0.1:8000/api/predict/location", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        latitude: Number(location.latitude),
        longitude: Number(location.longitude),
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Location prediction failed");
      return;
    }

    // 🔥 BEST CROP
    setResult(data.crop);

    // 🔥 CHART (TOP 5 ONLY)
    const maxScore = Math.max(...data.crops.map(c => c.score));

    setChartData(
      data.crops.map(item => ({
        name: item.name,
        score: Number(((item.score / maxScore) * 100).toFixed(2))  // normalization formula
      }))
    );

  } catch {
    setError("Server error!");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Sidebar />

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
          <div  key={error} className={`result-card ${error ? "error-card" : ""}`}>

            {error ? (
              <div className="result error">
                <h2>⚠ Invalid Input</h2>
                
               

                
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
                </div>
              </div>

            )}
          </div>

          

        </div>
      </div>
    </>
  )
}

