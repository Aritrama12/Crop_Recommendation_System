import React, { useEffect, useState } from "react";
import "../scss/FarmRecords.scss";
import Sidebar from "../components/Sidebar";
import {
  getPlantings,
  createPlanting,
  deletePlanting,

  getHarvests,
  createHarvest,
  deleteHarvest,

  getSales,
  createSale,
  deleteSale,

  getExpenses,
  createExpense,
  deleteExpense,

  getResources,
  createResource,
  deleteResource,
} from "../api/recordsApi";

const FarmRecords = () => {
  const [activeTab, setActiveTab] = useState("planting");

// ================= PLANTINGS =================

const [plantings, setPlantings] = useState([]);

const [plantingForm, setPlantingForm] = useState({
  planting_date: "",
  crop: "",
  field_name: "",
  area: "",
  expected_yield: "",
});

// fetch plantings
const fetchPlantings = async () => {
  try {
    const res = await getPlantings();
    setPlantings(res.data.results || res.data);
  } catch (err) {
    console.error(err);
  }
};

// handlers
const handlePlantingChange = (e) => {
  setPlantingForm({
    ...plantingForm,
    [e.target.name]: e.target.value,
  });
};

const handlePlantingSubmit = async () => {
  try {
    await createPlanting(plantingForm);

    setPlantingForm({
      planting_date: "",
      crop: "",
      field_name: "",
      area: "",
      expected_yield: "",
    });

    fetchPlantings();
  } catch (err) {
    console.error(err);
  }
};

const handleDeletePlanting = async (id) => {
  try {
    await deletePlanting(id);
    fetchPlantings();
  } catch (err) {
    console.error(err);
  }
};

// ================= HARVESTS =================

const [harvests, setHarvests] = useState([]);

const [harvestForm, setHarvestForm] = useState({
  harvest_date: "",
  crop: "",
  field_name: "",
  area: "",
  total_harvest: "",
  quality: "Good",
});



// fetch harvests
const fetchHarvests = async () => {
  try {
    const res = await getHarvests();
    setHarvests(res.data.results || res.data);
  } catch (err) {
    console.error(err);
  }
};



// handlers
const handleHarvestChange = (e) => {
  setHarvestForm({
    ...harvestForm,
    [e.target.name]: e.target.value,
  });
};

const handleHarvestSubmit = async () => {
  try {
    await createHarvest(harvestForm);

    setHarvestForm({
      harvest_date: "",
      crop: "",
      field_name: "",
      area: "",
      total_harvest: "",
      quality: "Good",
    });

    fetchHarvests();
  } catch (err) {
    console.error(err);
  }
};

const handleDeleteHarvest = async (id) => {
  try {
    await deleteHarvest(id);

    fetchHarvests();
  } catch (err) {
    console.error(err);
  }
};

// ================= SALES =================

const [sales, setSales] = useState([]);

const [saleForm, setSaleForm] = useState({
  sale_date: "",
  crop: "",
  quantity: "",
  price_per_ton: "",
  buyer: "",
});


// fetch sales
const fetchSales = async () => {
  try {
    const res = await getSales();
    setSales(res.data.results || res.data);
  } catch (err) {
    console.error(err);
  }
};


// handlers
const handleSaleChange = (e) => {
  setSaleForm({
    ...saleForm,
    [e.target.name]: e.target.value,
  });
};

const handleSaleSubmit = async () => {
  try {
    await createSale(saleForm);

    setSaleForm({
      sale_date: "",
      crop: "",
      quantity: "",
      price_per_ton: "",
      buyer: "",
    });

    fetchSales();
  } catch (err) {
    console.error(err);
  }
};

const handleDeleteSale = async (id) => {
  try {
    await deleteSale(id);

    fetchSales();
  } catch (err) {
    console.error(err);
  }
};

// ================= EXPENSES =================

const [expenses, setExpenses] = useState([]);

const [expenseForm, setExpenseForm] = useState({
  date: "",
  category: "Seeds",
  amount: "",
  description: "",
});



// fetch expenses
const fetchExpenses = async () => {
  try {
    const res = await getExpenses();
    setExpenses(res.data.results || res.data);
  } catch (err) {
    console.error(err);
  }
};


// handlers
const handleExpenseChange = (e) => {
  setExpenseForm({
    ...expenseForm,
    [e.target.name]: e.target.value,
  });
};

const handleExpenseSubmit = async () => {
  try {
    await createExpense(expenseForm);

    setExpenseForm({
      date: "",
      category: "Seeds",
      amount: "",
      description: "",
    });

    fetchExpenses();
  } catch (err) {
    console.error(err);
  }
};

const handleDeleteExpense = async (id) => {
  try {
    await deleteExpense(id);

    fetchExpenses();
  } catch (err) {
    console.error(err);
  }
};



// ================= RESOURCES =================

const [resources, setResources] = useState([]);

const [resourceForm, setResourceForm] = useState({
  date: "",
  resource_type: "Water",
  quantity: "",
  unit: "",
  field_name: "",
});

// fetch resources
const fetchResources = async () => {
  try {
    const res = await getResources();
    setResources(res.data.results || res.data);
  } catch (err) {
    console.error(err);
  }
};


// handlers
const handleResourceChange = (e) => {
  setResourceForm({
    ...resourceForm,
    [e.target.name]: e.target.value,
  });
};

const handleResourceSubmit = async () => {
  try {
    await createResource(resourceForm);

    setResourceForm({
      date: "",
      resource_type: "Water",
      quantity: "",
      unit: "",
      field_name: "",
    });

    fetchResources();
  } catch (err) {
    console.error(err);

  }
};


const handleDeleteResource = async (id) => {
  try {
    await deleteResource(id);

    fetchResources();
  } catch (err) {
    console.error(err);
  }
};







// ================= INITIAL DATA FETCH =================
useEffect(() => {
  fetchPlantings();
  fetchHarvests();
  fetchSales();
  fetchExpenses();
  fetchResources();
}, []);





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
                    <input
                      type="date"
                      name="planting_date"
                      value={plantingForm.planting_date}
                      onChange={handlePlantingChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Crop *</label>
                    <input
                      type="text"
                      name="crop"
                      value={plantingForm.crop}
                      onChange={handlePlantingChange}
                      placeholder="e.g., Wheat, Maize, Rice"
                    />                  
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Field Name *</label>
                    <input
                      type="text"
                      name="field_name"
                      value={plantingForm.field_name}
                      onChange={handlePlantingChange}
                      placeholder="e.g., North Field"
                    />
                  </div>

                  <div className="form-group">
                    <label>Area (hectares) *</label>
                    <input
                      type="number"
                      name="area"
                      value={plantingForm.area}
                      onChange={handlePlantingChange}
                      placeholder="e.g., 10"
                    />                  
                    </div>

                  <div className="form-group">
                    <label>Expected Yield (T/Ha) *</label>
                    <input
                      type="number"
                      name="expected_yield"
                      value={plantingForm.expected_yield}
                      onChange={handlePlantingChange}
                      placeholder="e.g., 4.5"
                    />
                  </div>
                </div>

                <button
                  className="submit-btn"
                  onClick={handlePlantingSubmit}
                >
                  <span>＋</span>
                  Add Planting Record
                </button>
              </div>
            </div>

            {/* Planting History */}
            <div className="farm-history-card">
              <h2>Planting History</h2>

              <p className="history-subtitle">
                {plantings.length} records
              </p>

              {plantings.map((item) => (
                <div
                  className="history-item"
                  key={item.id}
                >
                  <div className="left">
                    <div className="icon">🌱</div>

                    <div>
                      <h3>{item.crop}</h3>

                      <p>
                        📍 {item.field_name} • {item.area} ha
                      </p>

                      <p>
                        📅 {item.planting_date}
                      </p>
                    </div>
                  </div>

                  <div className="right">
                    <p className="label">
                      Expected Yield
                    </p>

                    <h3>
                      {item.expected_yield} T/Ha
                    </h3>
                  </div>

                  <div
                    className="delete"
                    onClick={() =>
                      handleDeletePlanting(item.id)
                    }
                  >
                    🗑️
                  </div>
                </div>
              ))}
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
                    <input
                      type="date"
                      name="harvest_date"
                      value={harvestForm.harvest_date}
                      onChange={handleHarvestChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Crop *</label>
                    <input
                      type="text"
                      name="crop"
                      value={harvestForm.crop}
                      onChange={handleHarvestChange}
                      placeholder="e.g., Wheat, Maize, Rice"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Field Name *</label>
                    <input
                      type="text"
                      name="field_name"
                      value={harvestForm.field_name}
                      onChange={handleHarvestChange}
                      placeholder="e.g., North Field"
                    />
                  </div>

                  <div className="form-group">
                    <label>Area (hectares) *</label>
                    <input
                      type="number"
                      name="area"
                      value={harvestForm.area}
                      onChange={handleHarvestChange}
                      placeholder="e.g., 10"
                    />
                  </div>

                  <div className="form-group">
                    <label>Total Harvest (tons) *</label>
                    <input
                      type="number"
                      name="total_harvest"
                      value={harvestForm.total_harvest}
                      onChange={handleHarvestChange}
                      placeholder="e.g., 51"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full">
                    <label>Crop Quality</label>
                    <select
                      name="quality"
                      value={harvestForm.quality}
                      onChange={handleHarvestChange}
                    >
                      <option value="Good">Good</option>
                      <option value="Average">Average</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Poor">Poor</option>
                    </select>
                  </div>
                </div>

                <button
                  className="submit-btn"
                  onClick={handleHarvestSubmit}
                >
                  <span>＋</span> Add Harvest Record
                </button>
              </div>
            </div>

            {/* Harvest History */}
            <div className="farm-history-card">
              <h2>Harvest History</h2>

              <p className="history-subtitle">
                {harvests.length} records
              </p>

              {harvests.map((item) => (
                <div
                  className="history-item"
                  key={item.id}
                >
                  <div className="left">
                    <div className="icon harvest-icon">
                      📈
                    </div>

                    <div>
                      <h3>{item.crop}</h3>

                      <p>
                        📍 {item.field_name} • {item.area} ha
                      </p>

                      <p>
                        📅 {item.harvest_date}
                      </p>

                      <span
                        className={`tag ${item.quality?.toLowerCase()}`}
                      >
                        {item.quality}
                      </span>
                    </div>
                  </div>

                  <div className="right">
                    <p className="label">
                      Total Yield
                    </p>

                    <h3>
                      {item.total_harvest} tons
                    </h3>

                    <p className="yield">
                      {item.area > 0
                        ? (
                            item.total_harvest /
                            item.area
                          ).toFixed(2)
                        : "0.00"}{" "}
                      T/Ha
                    </p>
                  </div>

                  <div
                    className="delete"
                    onClick={() =>
                      handleDeleteHarvest(item.id)
                    }
                  >
                    🗑️
                  </div>
                </div>
              ))}
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
                    <input
                      type="date"
                      name="sale_date"
                      value={saleForm.sale_date}
                      onChange={handleSaleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Crop *</label>
                    <input
                      type="text"
                      name="crop"
                      value={saleForm.crop}
                      onChange={handleSaleChange}
                      placeholder="e.g., Wheat, Maize, Rice"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity (tons) *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={saleForm.quantity}
                      onChange={handleSaleChange}
                      placeholder="e.g., 50"
                    />
                  </div>

                  <div className="form-group">
                    <label>Price per Ton (₹) *</label>
                    <input
                      type="number"
                      name="price_per_ton"
                      value={saleForm.price_per_ton}
                      onChange={handleSaleChange}
                      placeholder="e.g., 25000"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full">
                    <label>Buyer *</label>
                    <input
                      type="text"
                      name="buyer"
                      value={saleForm.buyer}
                      onChange={handleSaleChange}
                      placeholder="e.g., Local Grain Market"
                    />
                  </div>
                </div>

                <button
                  className="submit-btn"
                  onClick={handleSaleSubmit}
                >
                  <span>＋</span>
                  Add Sale Record
                </button>
              </div>
            </div>

            {/* Sales History */}
            <div className="farm-history-card">
              <h2>Sales History</h2>

              <p className="history-subtitle">
                {sales.length} records
              </p>

              {sales.map((item) => (
                <div
                  className="history-item"
                  key={item.id}
                >
                  <div className="left">
                    <div className="icon sales-icon">
                      💲
                    </div>

                    <div>
                      <h3>{item.crop}</h3>

                      <p>
                        {item.quantity} tons × ₹
                        {Number(item.price_per_ton).toLocaleString()}
                        /ton
                      </p>

                      <p>
                        📅 {item.sale_date} • {item.buyer}
                      </p>
                    </div>
                  </div>

                  <div className="right">
                    <p className="label">
                      Revenue
                    </p>

                    <h3 className="revenue">
                      ₹
                      {(
                        Number(item.quantity) *
                        Number(item.price_per_ton)
                      ).toLocaleString()}
                    </h3>
                  </div>

                  <div
                    className="delete"
                    onClick={() =>
                      handleDeleteSale(item.id)
                    }
                  >
                    🗑️
                  </div>
                </div>
              ))}
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
                    <input
                      type="date"
                      name="date"
                      value={expenseForm.date}
                      onChange={handleExpenseChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Category *</label>
                    <select
                      name="category"
                      value={expenseForm.category}
                      onChange={handleExpenseChange}
                    >
                      <option value="Fertilizer">Fertilizer</option>
                      <option value="Seeds">Seeds</option>
                      <option value="Labor">Labor</option>
                      <option value="Equipment">Equipment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full">
                    <label>Amount (₹) *</label>
                    <input
                      type="number"
                      name="amount"
                      value={expenseForm.amount}
                      onChange={handleExpenseChange}
                      placeholder="e.g., 15000"
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full">
                    <label>Description *</label>
                    <input
                      type="text"
                      name="description"
                      value={expenseForm.description}
                      onChange={handleExpenseChange}
                      placeholder="e.g., Wheat seeds - 200kg"
                    />
                  </div>
                </div>

                <button
                  className="submit-btn"
                  onClick={handleExpenseSubmit}
                >
                  <span>＋</span>
                  Add Expense Record
                </button>
              </div>
            </div>

            {/* Expense History */}
            <div className="farm-history-card">
              <h2>Expense History</h2>

              <p className="history-subtitle">
                {expenses.length} records
              </p>

              {expenses.map((item) => (
                <div
                  className="history-item"
                  key={item.id}
                >
                  <div className="left">
                    <div className="icon expense-icon">
                      🧾
                    </div>

                    <div>
                      <h3>{item.description}</h3>

                      <span className="tag">
                        {item.category}
                      </span>

                      <p>
                        📅 {item.date}
                      </p>
                    </div>
                  </div>

                  <div className="right">
                    <h3 className="expense">
                      -₹{Number(item.amount).toLocaleString()}
                    </h3>
                  </div>

                  <div
                    className="delete"
                    onClick={() =>
                      handleDeleteExpense(item.id)
                    }
                  >
                    🗑️
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ================= RESOURCES TAB ================= */}
        {activeTab === "resources" && (
          <>
            {/* Resource Form */}
            <div className="card">
              <h2>Add Resource Usage</h2>
              <p className="card-subtitle">
                Track water, fertilizer, and other resource usage
              </p>

              <div className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Date *</label>
                    <input
                      type="date"
                      name="date"
                      value={resourceForm.date}
                      onChange={handleResourceChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Resource Type *</label>
                    <select
                      name="resource_type"
                      value={resourceForm.resource_type}
                      onChange={handleResourceChange}
                    >
                      <option value="Water">Water</option>
                      <option value="Fertilizer">Fertilizer</option>
                      <option value="Pesticide">Pesticide</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Quantity *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={resourceForm.quantity}
                      onChange={handleResourceChange}
                      placeholder="e.g., 10000"
                    />
                  </div>

                  <div className="form-group">
                    <label>Unit *</label>
                    <input
                      type="text"
                      name="unit"
                      value={resourceForm.unit}
                      onChange={handleResourceChange}
                      placeholder="e.g., Liters, Kg"
                    />
                  </div>

                  <div className="form-group">
                    <label>Field *</label>
                    <input
                      type="text"
                      name="field_name"
                      value={resourceForm.field_name}
                      onChange={handleResourceChange}
                      placeholder="e.g., North Field"
                    />
                  </div>
                </div>

                <button
                  className="submit-btn"
                  onClick={handleResourceSubmit}
                >
                  <span>＋</span>
                  Add Resource Record
                </button>
              </div>
            </div>

            {/* Resource History */}
            <div className="farm-history-card">
              <h2>Resource Usage History</h2>

              <p className="history-subtitle">
                {resources.length} records
              </p>

              {resources.map((item) => (
                <div
                  className="history-item"
                  key={item.id}
                >
                  <div className="left">
                    <div className="icon resource-icon">
                      💧
                    </div>

                    <div>
                      <h3>{item.resource_type}</h3>

                      <p>
                        📍 {item.field_name}
                      </p>

                      <p>
                        📅 {item.date}
                      </p>
                    </div>
                  </div>

                  <div className="right">
                    <h3>
                      {Number(item.quantity).toLocaleString()}{" "}
                      {item.unit}
                    </h3>
                  </div>

                  <div
                    className="delete"
                    onClick={() =>
                      handleDeleteResource(item.id)
                    }
                  >
                    🗑️
                  </div>
                </div>
              ))}
            </div>
          </>
        )}


      </div>
    </>
  );
};

export default FarmRecords;