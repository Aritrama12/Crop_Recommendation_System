import React, { useState } from "react";
import "../scss/FarmRecords.scss";
import Sidebar from "../components/Sidebar";

const FarmRecords = () => {
  const [activeTab, setActiveTab] = useState("planting");

  return (
    <>
      <Sidebar />
      <div className="farm-records">

        <h1>Farm Records</h1>
        <p className="subtitle">
          Enter your real farming data after each harvest to generate insights and
          performance analytics
        </p>

        {/* Tabs */}
        <div className="farm-tabs">
          <button
            className={`farm-tab ${activeTab === "planting" ? "active" : ""}`}
            onClick={() => setActiveTab("planting")}
          >
            🌱 Planting
          </button>

          <button
            className={`farm-tab ${activeTab === "harvest" ? "active" : ""}`}
            onClick={() => setActiveTab("harvest")}
          >
            📈 Harvest
          </button>

          <button className="farm-tab">💲 Sales</button>
          <button className="farm-tab">🧾 Expenses</button>
          <button className="farm-tab">💧 Resources</button>
        </div>

        {/* ================= PLANTING TAB ================= */}
        {activeTab === "planting" && (
          <>
            <div className="card">
              <h2>Add Planting Record</h2>
              <p className="card-subtitle">
                Record new crop plantings on your farm
              </p>

              <div className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Planting Date *</label>
                    <input type="date" />
                  </div>

                  <div className="form-group">
                    <label>Crop *</label>
                    <input type="text" placeholder="e.g., Wheat, Maize, Rice" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Field Name *</label>
                    <input type="text" placeholder="e.g., North Field" />
                  </div>

                  <div className="form-group">
                    <label>Area (hectares) *</label>
                    <input type="number" placeholder="e.g., 10" />
                  </div>

                  <div className="form-group">
                    <label>Expected Yield (T/Ha) *</label>
                    <input type="number" placeholder="e.g., 4.5" />
                  </div>
                </div>

                <button className="submit-btn">
                  <span>＋</span> Add Planting Record
                </button>
              </div>
            </div>

            {/* Planting History */}
            <div className="farm-history-card">
                <h2>Planting History</h2>
                <p className="history-subtitle">3 records</p>

                {/* Item 1 */}
                <div className="history-item">
                    <div className="left">
                    <div className="icon">🌱</div>
                    <div>
                        <h3>Wheat</h3>
                        <p>📍 North Field • 10 ha</p>
                        <p>📅 3/15/2024</p>
                    </div>
                    </div>

                    <div className="right">
                    <p className="label">Expected Yield</p>
                    <h3>4.5 T/Ha</h3>
                    </div>

                    <div className="delete">🗑️</div>
                </div>

                {/* Item 2 */}
                <div className="history-item">
                    <div className="left">
                    <div className="icon">🌱</div>
                    <div>
                        <h3>Maize</h3>
                        <p>📍 East Field • 8 ha</p>
                        <p>📅 3/20/2024</p>
                    </div>
                    </div>

                    <div className="right">
                    <p className="label">Expected Yield</p>
                    <h3>7 T/Ha</h3>
                    </div>

                    <div className="delete">🗑️</div>
                </div>

                {/* Item 3 */}
                <div className="history-item">
                    <div className="left">
                    <div className="icon">🌱</div>
                    <div>
                        <h3>Soybean</h3>
                        <p>📍 South Field • 5 ha</p>
                        <p>📅 4/1/2024</p>
                    </div>
                    </div>

                    <div className="right">
                    <p className="label">Expected Yield</p>
                    <h3>2.5 T/Ha</h3>
                    </div>

                    <div className="delete">🗑️</div>
                </div>
                </div>
          </>
        )}

        {/* ================= HARVEST TAB ================= */}
        {activeTab === "harvest" && (
          <div className="card">
            <h2>Add Harvest Record</h2>
            <p className="card-subtitle">
              Log your crop harvests and yields
            </p>

            <div className="form">
              <div className="form-row">
                <div className="form-group">
                  <label>Harvest Date *</label>
                  <input type="date" />
                </div>

                <div className="form-group">
                  <label>Crop *</label>
                  <input type="text" placeholder="e.g., Wheat, Maize, Rice" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Field Name *</label>
                  <input type="text" placeholder="e.g., North Field" />
                </div>

                <div className="form-group">
                  <label>Area (hectares) *</label>
                  <input type="number" placeholder="e.g., 10" />
                </div>

                <div className="form-group">
                  <label>Total Harvest (tons) *</label>
                  <input type="number" placeholder="e.g., 51" />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group full">
                  <label>Crop Quality</label>
                  <select>
                    <option>Good</option>
                    <option>Average</option>
                    <option>Excellent</option>
                    <option>Poor</option>
                  </select>
                </div>
              </div>

              <button className="submit-btn">
                <span>＋</span> Add Harvest Record
              </button>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default FarmRecords;











