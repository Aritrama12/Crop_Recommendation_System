import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import "../scss/recommendation.scss"

export default function Recommendation() {
  const [formData, setFormData] = useState({
    N: "",
    P: "",
    K: "",
    temperature: "",
    humidity: "",
    ph: "",
    rainfall: "",
  });

  const [result, setResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://127.0.0.1:8000/api/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      setResult(data.crop);
      setShowModal(true);

    } catch (err) {
      setResult("Something went wrong!");
      setShowModal(true);
    }
  };

  return (
    <>
      <Sidebar />
      {/* <h1 className='heading'>Crop Recommendation</h1> */}

      <div className="crop-form-container">
  <form onSubmit={handleSubmit} className="form-card">

    <h2 className="form-title">🌾 Enter Soil & Climate Data</h2>
    <p className="form-subtitle">Fill the details to get the best crop</p>

    <div className="form-grid">

      <div className="input-box">
        <label>🌱 Nitrogen (N)</label>
        <input type="number" name="N" value={formData.N} onChange={handleChange} required />
      </div>

      <div className="input-box">
        <label>🌿 Phosphorus (P)</label>
        <input type="number" name="P" value={formData.P} onChange={handleChange} required />
      </div>

      <div className="input-box">
        <label>🍃 Potassium (K)</label>
        <input type="number" name="K" value={formData.K} onChange={handleChange} required />
      </div>

      <div className="input-box">
        <label>🌡 Temperature (°C)</label>
        <input type="number" name="temperature" value={formData.temperature} onChange={handleChange} required />
      </div>

      <div className="input-box">
        <label>💧 Humidity (%)</label>
        <input type="number" name="humidity" value={formData.humidity} onChange={handleChange} required />
      </div>

      <div className="input-box">
        <label>⚗ Soil pH</label>
        <input type="number" step="0.1" name="ph" value={formData.ph} onChange={handleChange} required />
      </div>

      <div className="input-box full-width">
        <label>🌧 Rainfall (mm)</label>
        <input type="number" name="rainfall" value={formData.rainfall} onChange={handleChange} required />
      </div>

    </div>

    <div className="button-group">
      <button type="submit" className="predict-btn">🌾 Predict Crop</button>
      <button type="button" className="clear-btn" onClick={handleClear}>Clear</button>
    </div>

  </form>
</div>


      {/* 🔥 MODAL */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2>🌱 Recommended Crop</h2>
            <p>{result}</p>
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}
    </>
  )
}
