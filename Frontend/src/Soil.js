import React, { useState } from "react";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState("current");

  return (
    <div className="container">
      <header className="header">
        <h1>🌱 Smart Soil Analysis</h1>
        <p>Overview of soil health, tests & smart recommendations</p>
      </header>

      <div className="tabs">
        <button
          className={activeTab === "current" ? "active" : ""}
          onClick={() => setActiveTab("current")}
        >
          Current
        </button>
        <button
          className={activeTab === "history" ? "active" : ""}
          onClick={() => setActiveTab("history")}
        >
          History
        </button>
        <button
          className={activeTab === "recommendations" ? "active" : ""}
          onClick={() => setActiveTab("recommendations")}
        >
          Recommendations
        </button>
      </div>

      {/* Panels */}
      {activeTab === "current" && (
        <section className="panel current">
          <div className="summary">
            <div>
              <h3>Soil Score</h3>
              <p className="score">78 / 100</p>
              <div className="bar">
                <span style={{ width: "78%" }}></span>
              </div>
            </div>
            <div>
              <h3>pH</h3>
              <p>6.8</p>
              <small>Near optimal for wheat</small>
            </div>
            <div>
              <h3>Moisture</h3>
              <p>18%</p>
              <small>Good</small>
            </div>
            <div>
              <p><b>Last test:</b> 15 March, 2024</p>
              <p><b>Next check:</b> in 30 days</p>
            </div>
          </div>

          <div className="nutrients">
            <div className="card">
              <h4>Nitrogen</h4>
              <p>45 kg/ha</p>
              <div className="bar"><span style={{ width: "70%" }}></span></div>
              <small>Add slow-release N fertilizer before tillering.</small>
            </div>
            <div className="card">
              <h4>Phosphorus</h4>
              <p>25 kg/ha</p>
              <div className="bar"><span style={{ width: "60%" }}></span></div>
              <small>Apply P-band placement in planting rows.</small>
            </div>
            <div className="card">
              <h4>Potassium</h4>
              <p>35 kg/ha</p>
              <div className="bar"><span style={{ width: "80%" }}></span></div>
              <small>Potassium levels are healthy for yield.</small>
            </div>
            <div className="card">
              <h4>Organic Matter</h4>
              <p>2.1%</p>
              <div className="bar"><span style={{ width: "50%" }}></span></div>
              <small>Add compost to improve OM over time.</small>
            </div>
          </div>

          <div className="actions">
            <button className="btn-green">+ Add Note</button>
            <button className="btn-white">Export report</button>
            <button className="btn-white">Set Reminder</button>
          </div>
        </section>
      )}

      {activeTab === "history" && (
        <section className="panel history">
          <div className="card">15 Mar 2024 - pH 6.8 | N:45 | P:25 | K:35 | OM:2.1%</div>
          <div className="card">15 Feb 2024 - pH 6.6 | N:42 | P:23 | K:33 | OM:2.0%</div>
          <div className="card">15 Jan 2024 - pH 6.5 | N:40 | P:22 | K:32 | OM:1.9%</div>
        </section>
      )}

      {activeTab === "recommendations" && (
        <section className="panel recommend">
          <div className="card">
            <h3>🌾 Recommended Crops</h3>
            <ul>
              <li>Wheat 🌾</li>
              <li>Maize 🌽</li>
              <li>Pulses 🌱</li>
            </ul>
          </div>
          <div className="card">
            <h3>🧪 Fertilizer Suggestion</h3>
            <p>Use balanced NPK 10-26-26 and add compost for organic improvement.</p>
          </div>
        </section>
      )}

      <footer>CropWise Smart Agriculture © 2025</footer>
    </div>
  );
}

export default App;
