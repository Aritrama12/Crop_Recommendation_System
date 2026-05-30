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

          <button
            className={`farm-tab ${activeTab === "sales" ? "active" : ""}`}
            onClick={() => setActiveTab("sales")}
          >
            💲 Sales
          </button>

          <button
            className={`farm-tab ${activeTab === "expenses" ? "active" : ""}`}
            onClick={() => setActiveTab("expenses")}
          >
            🧾 Expenses
          </button>

          <button
            className={`farm-tab ${activeTab === "resources" ? "active" : ""}`}
            onClick={() => setActiveTab("resources")}
          >
            💧 Resources
          </button>
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
          <>
            {/* Harvest Form */}
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

            {/*  Harvest History */}
            <div className="farm-history-card">
              <h2>Harvest History</h2>
              <p className="history-subtitle">2 records</p>

              {/* Item 1 */}
              <div className="history-item">
                <div className="left">
                  <div className="icon harvest-icon">📈</div>
                  <div>
                    <h3>Wheat</h3>
                    <p>📍 North Field • 10 ha</p>
                    <p>📅 10/15/2024</p>
                    <span className="tag excellent">excellent</span>
                  </div>
                </div>

                <div className="right">
                  <p className="label">Total Yield</p>
                  <h3>51 tons</h3>
                  <p className="yield">5.10 T/Ha</p>
                </div>

                <div className="delete">🗑️</div>
              </div>

              {/* Item 2 */}
              <div className="history-item">
                <div className="left">
                  <div className="icon harvest-icon">📈</div>
                  <div>
                    <h3>Maize</h3>
                    <p>📍 East Field • 8 ha</p>
                    <p>📅 11/10/2024</p>
                    <span className="tag good">good</span>
                  </div>
                </div>

                <div className="right">
                  <p className="label">Total Yield</p>
                  <h3>66 tons</h3>
                  <p className="yield">8.25 T/Ha</p>
                </div>

                <div className="delete">🗑️</div>
              </div>
            </div>
          </>
        )}


        {/* ================= SALES TAB ================= */}
        {activeTab === "sales" && (
          <>
            {/* Sales Form */}
            <div className="card">
              <h2>Add Sale Record</h2>
              <p className="card-subtitle">
                Record crop sales and revenue
              </p>

              <div className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Sale Date *</label>
                    <input type="date" />
                  </div>

                  <div className="form-group">
                    <label>Crop *</label>
                    <input type="text" placeholder="e.g., Wheat, Maize, Rice" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity (tons) *</label>
                    <input type="number" placeholder="e.g., 50" />
                  </div>

                  <div className="form-group">
                    <label>Price per Ton (₹) *</label>
                    <input type="number" placeholder="e.g., 25000" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full">
                    <label>Buyer *</label>
                    <input type="text" placeholder="e.g., Local Grain Market" />
                  </div>
                </div>

                <button className="submit-btn">
                  <span>＋</span> Add Sale Record
                </button>
              </div>
            </div>

            {/*  Sales History */}
            <div className="farm-history-card">
              <h2>Sales History</h2>
              <p className="history-subtitle">2 records</p>

              {/* Item 1 */}
              <div className="history-item">
                <div className="left">
                  <div className="icon sales-icon">💲</div>
                  <div>
                    <h3>Wheat</h3>
                    <p>50 tons × ₹25,000/ton</p>
                    <p>📅 10/20/2024 • Local Grain Market</p>
                  </div>
                </div>

                <div className="right">
                  <p className="label">Revenue</p>
                  <h3 className="revenue">₹1,250,000</h3>
                </div>

                <div className="delete">🗑️</div>
              </div>

              {/* Item 2 */}
              <div className="history-item">
                <div className="left">
                  <div className="icon sales-icon">💲</div>
                  <div>
                    <h3>Maize</h3>
                    <p>65 tons × ₹22,000/ton</p>
                    <p>📅 11/15/2024 • Regional Distributor</p>
                  </div>
                </div>

                <div className="right">
                  <p className="label">Revenue</p>
                  <h3 className="revenue">₹1,430,000</h3>
                </div>

                <div className="delete">🗑️</div>
              </div>
            </div>
          </>
        )}



        {/* ================= EXPENSES TAB ================= */}
        {activeTab === "expenses" && (
          <>
            {/* Expense Form */}
            <div className="card">
              <h2>Add Expense Record</h2>
              <p className="card-subtitle">
                Track farming costs and expenses
              </p>

              <div className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input type="date" />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select>
                      <option>Fertilizer</option>
                      <option>Seeds</option>
                      <option>Labor</option>
                      <option>Equipment</option>
                      <option>Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full">
                    <label>Amount (₹) *</label>
                    <input type="number" placeholder="e.g., 15000" />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full">
                    <label>Description *</label>
                    <input type="text" placeholder="e.g., Wheat seeds - 200kg" />
                  </div>
                </div>

                <button className="submit-btn">
                  <span>＋</span> Add Expense Record
                </button>
              </div>
            </div>

            {/* Expense History */}
            <div className="farm-history-card">
              <h2>Expense History</h2>
              <p className="history-subtitle">3 records</p>

              {/* Item 1 */}
              <div className="history-item">
                <div className="left">
                  <div className="icon expense-icon">🧾</div>
                  <div>
                    <h3>Wheat seeds - 200kg</h3>
                    <span className="tag">seeds</span>
                    <p>📅 3/10/2024</p>
                  </div>
                </div>

                <div className="right">
                  <h3 className="expense">-₹15,000</h3>
                </div>

                <div className="delete">🗑️</div>
              </div>

              {/* Item 2 */}
              <div className="history-item">
                <div className="left">
                  <div className="icon expense-icon">🧾</div>
                  <div>
                    <h3>DAP and Urea fertilizer</h3>
                    <span className="tag">fertilizer</span>
                    <p>📅 4/5/2024</p>
                  </div>
                </div>

                <div className="right">
                  <h3 className="expense">-₹35,000</h3>
                </div>

                <div className="delete">🗑️</div>
              </div>

              {/* Item 3 */}
              <div className="history-item">
                <div className="left">
                  <div className="icon expense-icon">🧾</div>
                  <div>
                    <h3>Harvest labor - 10 workers</h3>
                    <span className="tag">labor</span>
                    <p>📅 10/10/2024</p>
                  </div>
                </div>

                <div className="right">
                  <h3 className="expense">-₹25,000</h3>
                </div>

                <div className="delete">🗑️</div>
              </div>
            </div>
          </>
        )}

        {/* ================= RESOURCES TAB ================= */}
        {activeTab === "resources" && (
          <>
            <div className="card">
              <h2>Add Resource Usage</h2>
              <p className="card-subtitle">
                Track water, fertilizer, and other resource usage
              </p>

              <div className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input type="date" />
                  </div>

                  <div className="form-group">
                    <label>Resource Type *</label>
                    <select>
                      <option>Fertilizer</option>
                      <option>Water</option>
                      <option>Pesticide</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity (₹) *</label>
                    <input type="number" placeholder="e.g., 10000" />
                  </div>

                  <div className="form-group">
                    <label>Unit *</label>
                    <input type="text" placeholder="e.g., Liters,Kg" />
                  </div>

                  <div className="form-group">
                    <label>Field *</label>
                    <input type="text" placeholder="e.g., North Field" />
                  </div>
                </div>

                <button className="submit-btn">
                  <span>＋</span> Add Expense Record
                </button>
              </div>
            </div>

              {/* Resource Usage History */}
              <div className="farm-history-card">
                <h2>Resource Usage History</h2>
                <p className="history-subtitle">2 records</p>

                {/* Item 1 */}
                <div className="history-item">
                  <div className="left">
                    <div className="icon resource-icon">💧</div>
                    <div>
                      <h3>Water</h3>
                      <p>📍 North Field</p>
                      <p>📅 5/15/2024</p>
                    </div>
                  </div>

                  <div className="right">
                    <h3>10,000 liters</h3>
                  </div>

                  <div className="delete">🗑️</div>
                </div>

                {/* Item 2 */}
                <div className="history-item">
                  <div className="left">
                    <div className="icon resource-icon">💧</div>
                    <div>
                      <h3>Fertilizer</h3>
                      <p>📍 East Field</p>
                      <p>📅 6/20/2024</p>
                    </div>
                  </div>

                  <div className="right">
                    <h3>500 kg</h3>
                  </div>

                  <div className="delete">🗑️</div>
                </div>
              </div>        

          </>
        )}


      </div>
    </>
  );
};

export default FarmRecords;











