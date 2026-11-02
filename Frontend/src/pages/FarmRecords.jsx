import React, { useEffect, useState } from "react";
import "../scss/FarmRecords.scss";
import Sidebar from "../components/Sidebar";
import { useTranslation } from "react-i18next";
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
} from "../api/recordsAPI";

const FarmRecords = () => {
  const [activeTab, setActiveTab] = useState("planting");
  const { t } = useTranslation();

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

        <h1>{t("farm_records_title")}</h1>
        <p className="subtitle">
           {t("farm_records_subtitle")}
        </p>

        {/* Tabs */}
        <div className="farm-tabs">
          <button
            className={`farm-tab ${activeTab === "planting" ? "active" : ""}`}
            onClick={() => setActiveTab("planting")}
          >
            🌱 {t("planting")}
          </button>

          <button
            className={`farm-tab ${activeTab === "harvest" ? "active" : ""}`}
            onClick={() => setActiveTab("harvest")}
          >
            📈 {t("harvest")}
          </button>

          <button
            className={`farm-tab ${activeTab === "sales" ? "active" : ""}`}
            onClick={() => setActiveTab("sales")}
          >
            💲 {t("sales")}
          </button>

          <button
            className={`farm-tab ${activeTab === "expenses" ? "active" : ""}`}
            onClick={() => setActiveTab("expenses")}
          >
            🧾 {t("expenses")}
          </button>

          <button
            className={`farm-tab ${activeTab === "resources" ? "active" : ""}`}
            onClick={() => setActiveTab("resources")}
          >
            💧 {t("resources")}
          </button>
        </div>

        {/* ================= PLANTING TAB ================= */}
        {activeTab === "planting" && (
          <>
            <div className="card">
              <h2>{t("add_planting_record")}</h2>
              <p className="card-subtitle">
                {t("planting_record_subtitle")}
              </p>

              <div className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label>{t("planting_date")} *</label>
                    <input
                      type="date"
                      name="planting_date"
                      value={plantingForm.planting_date}
                      onChange={handlePlantingChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t("Crop")} *</label>
                    <input
                      type="text"
                      name="crop"
                      value={plantingForm.crop}
                      onChange={handlePlantingChange}
                    placeholder={t("example_crop")}
                    />                  
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t("field_name")} *</label>
                    <input
                      type="text"
                      name="field_name"
                      value={plantingForm.field_name}
                      onChange={handlePlantingChange}
                      placeholder={t("north_field")}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t("area")} ({t("hectares")}) *</label>
                    <input
                      type="number"
                      name="area"
                      value={plantingForm.area}
                      onChange={handlePlantingChange}
                      placeholder={t("example_area")}
                    />                  
                    </div>

                  <div className="form-group">
                    <label>{t("expected_yield")} ({t("t_per_ha")}) *</label>
                    <input
                      type="number"
                      name="expected_yield"
                      value={plantingForm.expected_yield}
                      onChange={handlePlantingChange}
                      placeholder={t("example_expected_yield")}
                    />
                  </div>
                </div>

                <button
                  className="submit-btn"
                  onClick={handlePlantingSubmit}
                >
                  <span>＋</span>
                   {t("add_planting_record")}
                </button>
              </div>
            </div>

            {/* Planting History */}
            <div className="farm-history-card">
              <h2>{t("planting_history")}</h2>

              <p className="history-subtitle">
                {t("records",{count:plantings.length})}
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
                        📍 {item.field_name} • {item.area} {t("ha")}
                      </p>

                      <p>
                        📅 {item.planting_date}
                      </p>
                    </div>
                  </div>

                  <div className="right">
                    <p className="label">
                     {t("expected_yield_label")}
                    </p>

                    <h3>
                     {item.expected_yield} {t("t_per_ha")}
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
              <h2>{t("add_harvest_record")}</h2>
              <p className="card-subtitle">
                {t("harvest_record_subtitle")}
              </p>

              <div className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label>{t("harvest_date")} *</label>
                    <input
                      type="date"
                      name="harvest_date"
                      value={harvestForm.harvest_date}
                      onChange={handleHarvestChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t("Crop")} *</label>
                    <input
                      type="text"
                      name="crop"
                      value={harvestForm.crop}
                      onChange={handleHarvestChange}
                      placeholder={t("example_crop")}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t("field_name")} *</label>
                    <input
                      type="text"
                      name="field_name"
                      value={harvestForm.field_name}
                      onChange={handleHarvestChange}
                      placeholder={t("north_field")}
                    />
                  </div>

                  <div className="form-group">
                    <label> {t("area")} ({t("hectares")}) *</label>
                    <input
                      type="number"
                      name="area"
                      value={harvestForm.area}
                      onChange={handleHarvestChange}
                      placeholder="e.g., 10"
                    />
                  </div>

                  <div className="form-group">
                    <label>{t("total_harvest")} ({t("tons")}) *</label>
                    <input
                      type="number"
                      name="total_harvest"
                      value={harvestForm.total_harvest}
                      onChange={handleHarvestChange}
                      placeholder={t("example_total_harvest")}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full">
                    <label>{t("crop_quality")}</label>
                    <select
                      name="quality"
                      value={harvestForm.quality}
                      onChange={handleHarvestChange}
                    >
                      <option value="Good">{t("good")}</option>
                     <option value="Average">{t("average")}</option>
                     <option value="Excellent">{t("excellent")}</option>
                     <option value="Poor">{t("poor")}</option>
                    </select>
                  </div>
                </div>

                <button
                  className="submit-btn"
                  onClick={handleHarvestSubmit}
                >
                  <span>＋</span> {t("add_harvest_record")}
                </button>
              </div>
            </div>

            {/* Harvest History */}
            <div className="farm-history-card">
              <h2>{t("harvest_history")}</h2>

              <p className="history-subtitle">
                {t("records", { count: harvests.length })}
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
                      {t("total_yield")}
                    </p>

                    <h3>
                      {item.total_harvest} {t("tons")}
                    </h3>

                    <p className="yield">
                      {item.area > 0
                        ? (
                            item.total_harvest /
                            item.area
                          ).toFixed(2)
                        : "0.00"}{" "}
                     {t("t_per_ha")}
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
              <h2>{t("add_sale_record")}</h2>
              <p className="card-subtitle">
              {t("sale_record_subtitle")}
              </p>

              <div className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label>{t("sale_date")} *</label>
                    <input
                      type="date"
                      name="sale_date"
                      value={saleForm.sale_date}
                      onChange={handleSaleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t("Crop")} *</label>
                    <input
                      type="text"
                      name="crop"
                      value={saleForm.crop}
                      onChange={handleSaleChange}
                      placeholder={t("example_crop")}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t("quantity")} ({t("tons")})*</label>
                    <input
                      type="number"
                      name="quantity"
                      value={saleForm.quantity}
                      onChange={handleSaleChange}
                      placeholder={t("example_quantity")}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t("price_per_ton")} (₹) *</label>
                    <input
                      type="number"
                      name="price_per_ton"
                      value={saleForm.price_per_ton}
                      onChange={handleSaleChange}
                      placeholder={t("example_price")}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full">
                    <label>{t("buyer")} *</label>
                    <input
                      type="text"
                      name="buyer"
                      value={saleForm.buyer}
                      onChange={handleSaleChange}
                     placeholder={t("example_buyer")}
                    />
                  </div>
                </div>

                <button
                  className="submit-btn"
                  onClick={handleSaleSubmit}
                >
                  <span>＋</span>
                  {t("add_sale_record")}
                </button>
              </div>
            </div>

            {/* Sales History */}
            <div className="farm-history-card">
              <h2>{t("sales_history")}</h2>

              <p className="history-subtitle">
                {t("records",{count:sales.length})}
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
                      <h3>{t(`crop.${item.crop.toLowerCase()}`, item.crop)}</h3>

                      <p>
                         {item.quantity} {t("tons")} × ₹
          {Number(item.price_per_ton).toLocaleString()}
          /{t("ton")}
                      </p>

                      <p>
                        📅 {item.sale_date} • {item.buyer}
                      </p>
                    </div>
                  </div>

                  <div className="right">
                    <p className="label">
                       {t("revenue")}
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
              <h2>{t("add_expense_record")}</h2>
              <p className="card-subtitle">
                 {t("expense_record_subtitle")}
              </p>

              <div className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label>{t("date")} *</label>
                    <input
                      type="date"
                      name="date"
                      value={expenseForm.date}
                      onChange={handleExpenseChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t("category")} *</label>
                    <select
                      name="category"
                      value={expenseForm.category}
                      onChange={handleExpenseChange}
                    >
                      <option value="Fertilizer">
                {t("fertilizer")}
              </option>

              <option value="Seeds">
                {t("seeds")}
              </option>

              <option value="Labor">
                {t("labor")}
              </option>

              <option value="Equipment">
                {t("equipment")}
              </option>

              <option value="Other">
                {t("other")}
              </option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full">
                    <label>{t("amount")}  (₹) *</label>
                    <input
                      type="number"
                      name="amount"
                      value={expenseForm.amount}
                      onChange={handleExpenseChange}
                      placeholder={t("example_amount")}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group full">
                    <label>{t("description")} *</label>
                    <input
                      type="text"
                      name="description"
                      value={expenseForm.description}
                      onChange={handleExpenseChange}
                     placeholder={t("example_description")}
                    />
                  </div>
                </div>

                <button
                  className="submit-btn"
                  onClick={handleExpenseSubmit}
                >
                  <span>＋</span>
                  {t("add_expense_record")}
                </button>
              </div>
            </div>

            {/* Expense History */}
            <div className="farm-history-card">
              <h2>{t("expense_history")}</h2>

              <p className="history-subtitle">
                 {t("records", { count: expenses.length })}
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
                          {t(item.category.toLowerCase())}
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
              <h2>{t("add_resource_record")}</h2>
              <p className="card-subtitle">
               {t("resource_record_subtitle")}
              </p>

              <div className="form">
                <div className="form-row">
                  <div className="form-group">
                    <label>{t("date")} *</label>
                    <input
                      type="date"
                      name="date"
                      value={resourceForm.date}
                      onChange={handleResourceChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t("resource_type")} *</label>
                    <select
                      name="resource_type"
                      value={resourceForm.resource_type}
                      onChange={handleResourceChange}
                    >
                       <option value="Water">{t("water")}</option>
              <option value="Fertilizer">{t("fertilizer")}</option>
              <option value="Pesticide">{t("pesticide")}</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>{t("quantity")}  *</label>
                    <input
                      type="number"
                      name="quantity"
                      value={resourceForm.quantity}
                      onChange={handleResourceChange}
                      placeholder={t("example_resource_quantity")}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t("unit")} *</label>
                    <input
                      type="text"
                      name="unit"
                      value={resourceForm.unit}
                      onChange={handleResourceChange}
                      placeholder={t("example_unit")}
                    />
                  </div>

                  <div className="form-group">
                    <label>{t("field")} *</label>
                    <input
                      type="text"
                      name="field_name"
                      value={resourceForm.field_name}
                      onChange={handleResourceChange}
                      placeholder={t("north_field")}
                    />
                  </div>
                </div>

                <button
                  className="submit-btn"
                  onClick={handleResourceSubmit}
                >
                  <span>＋</span>
                  {t("add_resource_record")}
                </button>
              </div>
            </div>

            {/* Resource History */}
            <div className="farm-history-card">
              <h2>{t("resource_history")}</h2>

              <p className="history-subtitle">
                {t("records", {
              count: resources.length,
            })}
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