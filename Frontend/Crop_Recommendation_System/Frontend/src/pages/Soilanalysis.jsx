import React, { useState } from "react";
import "../scss/Soilanalysis.scss";
const SoilAnalysisDashboard = () => {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <div className="dashboard">
      {/* Top Banner Section */}
      <div className="top-banner">
        <img
          src="https://images.unsplash.com/photo-1613145993481-b3e9a05ad63e"
          alt="Professional Soil Testing"
          className="banner-image"
        />
        <div className="banner-overlay">
          <h1>🧪 Professional Soil Testing</h1>
          <p>Accurate analysis for better farming decisions 🌾</p>
        </div>
      </div>

      <h2 className="main-title">Soil Analysis Dashboard</h2>
      <p className="subtitle">
        Monitor soil health and get recommendations for optimal crop growth.
      </p>

      {/* Tab Buttons */}
      <div className="tabs">
        <button
          onClick={() => setActiveTab("current")}
          className={activeTab === "current" ? "active" : ""}
        >
          🌾 Current Analysis
        </button>
        <button
          onClick={() => setActiveTab("history")}
          className={activeTab === "history" ? "active" : ""}
        >
          📊 Historical Data
        </button>
        <button
          onClick={() => setActiveTab("recommendations")}
          className={activeTab === "recommendations" ? "active" : ""}
        >
          💡 Recommendations
        </button>
        <button
          onClick={() => setActiveTab("newtest")}
          className={activeTab === "newtest" ? "active" : ""}
        >
          🧾 New Test
        </button>
      </div>

      {/* Current Analysis */}
      {activeTab === "current" && (
        <div className="analysis-vertical">
          <div className="card good">
            <h3>🌿 Nitrogen</h3>
            <p>Maintain current levels with organic compost.</p>
            <p className="value">Current: <b>45 kg/ha</b></p>
            <span className="priority">Low Priority</span>
          </div>

          <div className="card medium">
            <h3>🧪 Phosphorus</h3>
            <p>Apply DAP fertilizer – 50kg per hectare.</p>
            <p className="value">Current: <b>25 kg/ha</b></p>
            <span className="priority medium">Medium Priority</span>
          </div>

          <div className="card low">
            <h3>🍂 Potassium</h3>
            <p>Consider potash application before next season.</p>
            <p className="value">Current: <b>35 kg/ha</b></p>
            <span className="priority">Low Priority</span>
          </div>

          <div className="card good">
            <h3>💧 pH Level</h3>
            <p>Perfect for most crops. No adjustment needed.</p>
            <p className="value">Current: <b>6.8</b></p>
            <span className="priority">Low Priority</span>
          </div>
        </div>
      )}

      {/* Historical Data */}
      {activeTab === "history" && (
        <div className="history">
          <h2>📆 Soil Analysis History</h2>
          <div className="history-item">
            <p><b>Date:</b> 15/01/2024</p>
            <p>pH: 6.5 | N: 40 | P: 22 | K: 32 | OM: 1.9%</p>
          </div>
          <div className="history-item">
            <p><b>Date:</b> 15/02/2024</p>
            <p>pH: 6.6 | N: 42 | P: 23 | K: 33 | OM: 2.0%</p>
          </div>
          <div className="history-item">
            <p><b>Date:</b> 15/03/2024</p>
            <p>pH: 6.8 | N: 45 | P: 25 | K: 35 | OM: 2.1%</p>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {activeTab === "recommendations" && (
        <div className="recommendations">
          <h2>💡 Smart Soil Recommendations</h2>
          <div className="recommendation-card">
            <h3>🌾 Fertilizer Plan</h3>
            <p>
              Apply **organic compost** for nitrogen balance and **DAP fertilizer**
              for phosphorus. Ensure proper mixing with soil.
            </p>
          </div>
          <div className="recommendation-card">
            <h3>💧 Irrigation Tip</h3>
            <p>
              Maintain consistent moisture. Overwatering can lead to nutrient
              leaching — use drip irrigation if possible.
            </p>
          </div>
          <div className="recommendation-card">
            <h3>🌞 Seasonal Advice</h3>
            <p>
              Before next season, test soil again to monitor potassium improvement
              and maintain pH around 6.8.
            </p>
          </div>
        </div>
      )}

      {/* New Test Section */}
      {activeTab === "newtest" && (
        <div className="new-test">
          <h2>🧾 Schedule New Soil Test</h2>
          <form>
            <input type="text" placeholder="Enter farm location" />
            <input type="number" placeholder="Area to test (hectares)" />
            <select>
              <option>Select test type</option>
              <option>Basic Nutrient Analysis</option>
              <option>Detailed Organic Matter Analysis</option>
            </select>
            <input type="date" />
            <div className="upload">
              <p>📸 Upload Soil Sample Photos</p>
              <input type="file" multiple />
            </div>
            <button type="submit">📤 Schedule Test – ₹2,500</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default SoilAnalysisDashboard;