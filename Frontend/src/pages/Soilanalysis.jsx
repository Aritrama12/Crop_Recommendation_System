//updated soilAnalysis.jsx
import React, { useState, useEffect } from "react";
import {
 PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from "recharts";
import "../scss/soilanalysis.scss";
import { FiUpload, FiPlus, FiX } from "react-icons/fi";
import Sidebar from "../components/Sidebar";
import { soilAPI } from "../api/soilApi";
import toast from "react-hot-toast";

export default function SoilAnalysis() {
  const [activeTab, setActiveTab] = useState("current");
  const [showForm, setShowForm] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [summary, setSummary] = useState({});
  const [latestTest, setLatestTest] = useState({});
  const [history, setHistory] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [analysisPopup, setAnalysisPopup] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  const [formData, setFormData] = useState({
    field_name: "",
    test_date: "",
    nitrogen: "",
    phosphorus: "",
    potassium: "",
    ph: "",
    organic_carbon: "",
    moisture: "",
    notes: "",
  });

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      const [
        summaryRes,
        currentRes,
        historyRes,
        recommendationRes
      ] = await Promise.all([
        soilAPI.getSummary(),
        soilAPI.getCurrent(),
        soilAPI.getHistory(),
        soilAPI.getRecommendations()
      ]);

      setSummary(summaryRes.data);

      setLatestTest({
        field: currentRes?.data?.field_name || "",
        date: currentRes?.data?.test_date || "",
        nitrogen: currentRes?.data?.nitrogen || 0,
        phosphorus: currentRes?.data?.phosphorus || 0,
        potassium: currentRes?.data?.potassium || 0,
        ph: currentRes?.data?.ph || 0,
        organicCarbon: currentRes?.data?.organic_carbon || 0,
        moisture: currentRes?.data?.moisture || 0,
      });

      const historyData = Array.isArray(historyRes.data)
        ? historyRes.data
        : historyRes.data.results || [];

      setHistory(
        historyData.map((item) => ({
          field: item.field_name,
          date: item.test_date,
          n: item.nitrogen,
          p: item.phosphorus,
          k: item.potassium,
          ph: item.ph,
          status: item.status,
        }))
      );

      const recommendationData = Array.isArray(recommendationRes.data)
        ? recommendationRes.data
        : recommendationRes.data.results || [];

      // setRecommendations(
      //   recommendationData.map((item) => ({
      //     title: item.title,
      //     description: item.description,
      //     action_required: item.action_required,
      //     priority: item.priority,
      //     crop_name: item.crop_name,
      //     soil_reason: item.soil_reason,
      //     nutrient_notes: item.nutrient_notes,
      //     climate_notes: item.climate_notes,
      //   }))
      // );
      setRecommendations(
  recommendationData.map((item) => ({
    title: item.title,
    description: item.description,
    action_required: item.action_required,
    priority: item.priority,
    crop_name: item.crop_name,
    soil_reason: item.soil_reason,
    nutrient_notes: item.nutrient_notes,
    climate_notes: item.climate_notes,
  }))
);
    } catch (err) {
      console.log(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loading = toast.loading("Saving soil test...");

    try {
      await soilAPI.createTest(formData);

      toast.success("Saved successfully 🌱");

      setFormData({
        field_name: "",
        test_date: "",
        nitrogen: "",
        phosphorus: "",
        potassium: "",
        ph: "",
        organic_carbon: "",
        moisture: "",
        notes: "",
      });

      setShowForm(false);
      loadAllData();
    } catch {
      toast.error("Failed ❌");
    } finally {
      toast.dismiss(loading);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setShowForm(false);
    setShowImageForm(false);
    setSelectedImage(null);
    setImagePreview(null);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImage) {
      toast.error("Select image first");
      return;
    }

    const loading = toast.loading("Analyzing...");

    try {
      const fd = new FormData();
      fd.append("image", selectedImage);

      const res = await soilAPI.analyzeImage(fd);

      setAnalysisResult(res.data.analysis);
      setAnalysisPopup(true);

      setShowImageForm(false);
      setSelectedImage(null);
      setImagePreview(null);

      loadAllData();

      toast.success("Done 🌱");
    } catch {
      toast.error("Failed ❌");
    } finally {
      toast.dismiss(loading);
    }
  };

  const pieData = [
    { name: "Nitrogen (N) ", value: latestTest.nitrogen || 0 },
    { name: "Phosphorus (P)", value: latestTest.phosphorus || 0 },
    { name: "Potassium (K)", value: latestTest. potassium || 0 },
    { name: "Moisture", value: latestTest.moisture || 0 },
    {
    name: "Organic Carbon (C)",
    value: latestTest.organicCarbon || 0
  }
  ];

  const COLORS = ["#2f6f4f", "#d9ab3f", "#ef6b4a", "#3b82f6", "#891c8d"];

  return (
    <>
      <Sidebar />

      <div className="soil-analysis-page">

        <div className="top-header">
          <div>
            <h1>🧪 Soil Analysis</h1>
            <p>Monitor and analyze your soil health</p>
          </div>

          {activeTab === "current" && (
            <div className="header-btns">

              <button
                className="secondary-btn"
                onClick={() => {
                  setShowImageForm(!showImageForm);
                  setShowForm(false);
                }}
              >
                {showImageForm ? <FiX /> : <FiUpload />}
                {showImageForm ? "Cancel" : "Image Analysis"}
              </button>

              <button
                className="primary-btn"
                onClick={() => {
                  setShowForm(!showForm);
                  setShowImageForm(false);
                }}
              >
                {showForm ? <FiX /> : <FiPlus />}
                {showForm ? "Cancel" : "New Test"}
              </button>

            </div>
          )}
        </div>

        {/* summary */}
        <div className="summary-grid">

          <div className="card">
            <div className="icon green">🍃</div>
            <div>
              <h2>{summary?.overall_health}</h2>
              <p>Overall Health</p>
            </div>
          </div>

          <div className="card">
            <div className="icon green">📈</div>
            <div>
              <h2>{summary?.health_score}/100</h2>
              <p>Health Score</p>
            </div>
          </div>

          <div className="card">
            <div className="icon red">N</div>
            <div>
              <h2 className="low">
                {summary?.nutrient_status?.nitrogen}
              </h2>
              <p>Nitrogen</p>
            </div>
          </div>

          <div className="card">
            <div className="icon yellow">P</div>
            <div>
              <h2 className="high">
                {summary?.nutrient_status?.phosphorus}
              </h2>
              <p>Phosphorus</p>
            </div>
          </div>

          <div className="card">
            <div className="icon red">K</div>
            <div>
              <h2 className="low">
                {summary?.nutrient_status?.potassium}
              </h2>
              <p>Potassium</p>
            </div>
          </div>

          <div className="card">
            <div className="icon yellow">pH</div>
            <div>
              <h2 className="alkaline">
                {summary?.nutrient_status?.ph}
              </h2>
              <p>pH</p>
            </div>
          </div>

        </div>

        {/* tabs */}
        <div className="tabs">
          <button
            className={activeTab === "current" ? "active" : ""}
            onClick={() => handleTabChange("current")}
          >
            Current Analysis
          </button>

          <button
            className={activeTab === "history" ? "active" : ""}
            onClick={() => handleTabChange("history")}
          >
            Historical Data
          </button>

          <button
            className={activeTab === "recommendation" ? "active" : ""}
            onClick={() => handleTabChange("recommendation")}
          >
            Recommendations
          </button>
        </div>

        {/* CURRENT */}
        {activeTab === "current" && (
          <>
            {showImageForm && (
              <div className="image-box">
                <h3>Upload Soil Image</h3>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />

                {imagePreview && (
                  <img src={imagePreview} alt="" />
                )}

                <button
                  className="analyze-btn"
                  onClick={handleImageUpload}
                >
                  Analyze
                </button>
              </div>
            )}

            {/* {showForm && (
              <div className="manual-form-box">
                <form onSubmit={handleSubmit}>
                  <input
                    name="field_name"
                    placeholder="Field Name"
                    value={formData.field_name}
                    onChange={handleChange}
                  />

                  <input
                    type="date"
                    name="test_date"
                    value={formData.test_date}
                    onChange={handleChange}
                  />

                  <input
                    name="nitrogen"
                    placeholder="Nitrogen"
                    value={formData.nitrogen}
                    onChange={handleChange}
                  />

                  <button className="save-btn">
                    Save
                  </button>
                </form>
              </div>
            )} */}
            {showForm && (
  <div className="manual-form-box">
    <h2>Add Soil Test</h2>

    <form onSubmit={handleSubmit}>

      <div className="form-grid two">
        <div>
          <label>Field Name *</label>
          <input
            type="text"
            name="field_name"
            value={formData.field_name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Test Date *</label>
          <input
            type="date"
            name="test_date"
            value={formData.test_date}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-grid three">
        <div>
          <label>Nitrogen</label>
          <input
            type="number"
            name="nitrogen"
            placeholder="Nitrogen"
            value={formData.nitrogen}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Phosphorus</label>
          <input
            type="number"
            name="phosphorus"
            placeholder="Phosphorus"
            value={formData.phosphorus}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Potassium</label>
          <input
            type="number"
            name="potassium"
            placeholder="Potassium"
            value={formData.potassium}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="form-grid three">
        <div>
          <label>pH</label>
          <input
            type="number"
            step="0.1"
            name="ph"
            placeholder="pH"
            value={formData.ph}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Organic Carbon</label>
          <input
            type="number"
            step="0.1"
            name="organic_carbon"
            placeholder="Organic Carbon"
            value={formData.organic_carbon}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label>Moisture</label>
          <input
            type="number"
            step="0.1"
            name="moisture"
            placeholder="Moisture"
            value={formData.moisture}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="notes">
        <label>Notes</label>
        <textarea
          rows="5"
          name="notes"
          placeholder="Additional notes..."
          value={formData.notes}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="save-btn">
        <FiPlus />
        Save Test
      </button>

    </form>
  </div>
)}

            <div className="content-box modern-current-box">

              <div className="current-left">
                <h2>Latest Soil Test - {latestTest.field}</h2>
                <p>Date: {latestTest.date}</p>

                <div className="metric-grid">
                  <div className="metric-card">
                    <h3>{latestTest.nitrogen} kg/ha</h3>
                    <span>Nitrogen</span>
                  </div>

                  <div className="metric-card">
                    <h3>{latestTest.phosphorus} kg/ha</h3>
                    <span>Phosphorus</span>
                  </div>

                  <div className="metric-card">
                    <h3>{latestTest.potassium} kg/ha</h3>
                    <span>Potassium</span>
                  </div>

                  <div className="metric-card">
                    <h3>{latestTest.ph}</h3>
                    <span>pH</span>
                  </div>

                  <div className="metric-card">
                    <h3>{latestTest.organicCarbon}%</h3>
                    <span>Organic Carbon</span>
                  </div>

                  <div className="metric-card">
                    <h3>{latestTest.moisture}%</h3>
                    <span>Moisture</span>
                  </div>
                </div>
              </div>

              <div className="chart-side">
                <h2>Nutrient Distribution</h2>

                <PieChart width={450} height={300}>
                  {/* <Pie
                    data={pieData}
                    cx="40%"
                    cy="50%"
                    outerRadius={110}
                    label
                    dataKey="value"
                  >
                    {pieData.map((_, i) => (
                      <Cell
                        key={i}
                        fill={COLORS[i]}
                      />
                    ))}
                  </Pie> */}
 <Pie
  data={pieData}
  cx="80%"
  cy="50%"
  outerRadius={110}
  innerRadius={55}   // makes donut style (optional)
  dataKey="value"
  label={({ percent }) =>
    `${(percent * 100).toFixed(1)}%`
  }
  labelLine={false}
>
  {pieData.map((_, i) => (
    <Cell
      key={i}
      fill={COLORS[i]}
    />
  ))}
</Pie>

<Legend
  layout="vertical"
  align="right"
  verticalAlign="middle"
  wrapperStyle={{
    right: -100,
    lineHeight: "32px",
    paddingLeft: "60px"
  }}
/>
                </PieChart>
              </div>

            </div>
          </>
        )}

        {/* HISTORY */}
        {activeTab === "history" && (
          <div className="content-box">
            <table>
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Date</th>
                  <th>N</th>
                  <th>P</th>
                  <th>K</th>
                  <th>pH</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item, i) => (
                  <tr key={i}>
                    <td>{item.field}</td>
                    <td>{item.date}</td>
                    <td>{item.n}</td>
                    <td>{item.p}</td>
                    <td>{item.k}</td>
                    <td>{item.ph}</td>
                    <td>
  <span className={`status ${item.status?.toLowerCase()}`}>
    {item.status}
  </span>
</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* recommendation */}
        {/* {activeTab === "recommendation" && (
          <div className="content-box recommendation-list">
            {recommendations.map((item, i) => (
              <div className="recommend-card" key={i}>
                <h3>{item.crop_name}</h3>
                <p>{item.description}</p>
                <p>{item.action_required}</p>
              </div>
            ))}
          </div>
        )} */}
        {/* RECOMMENDATION */}
{activeTab === "recommendation" && (
  <div className="content-box recommendation-list">
    {recommendations.length > 0 ? (
      recommendations.map((item, i) => (
        <div
          key={i}
          className={`recommend-card ${item.priority || "medium"}`}
        >
          {/* LEFT */}
          <div className="rec-main">
            <h3 className="crop-title">
              🌾 {item.crop_name || item.title}
            </h3>

            <p className="crop-desc">
              {item.description}
            </p>

            <div className="crop-details">
              {item.soil_reason && (
                <p>
                  <strong>Soil Suitability:</strong>{" "}
                  {item.soil_reason}
                </p>
              )}

              {item.nutrient_notes && (
                <p>
                  <strong>Nutrient Insight:</strong>{" "}
                  {item.nutrient_notes}
                </p>
              )}

              {item.climate_notes && (
                <p>
                  <strong>Climate Fit:</strong>{" "}
                  {item.climate_notes}
                </p>
              )}
            </div>

            {item.action_required && (
              <div className="action-box">
                <strong>Recommended Action:</strong>
                <p>{item.action_required}</p>
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="rec-badge">
            <span className={item.priority}>
              {item.priority}
            </span>
          </div>
        </div>
      ))
    ) : (
      <p>No recommendations available</p>
    )}
  </div>
)}

      </div>

      {analysisPopup && analysisResult && (
        <div className="popup-overlay">
          <div className="analysis-popup">
            <button
              className="close-popup"
              onClick={() => setAnalysisPopup(false)}
            >
              <FiX />
            </button>

            <h2>🌱 Analysis Result</h2>

            <div className="popup-result-grid">
              <div className="result-card">
                 

                <h3>Soil Type : {analysisResult.soil_type}</h3>
               
              </div>

              <div className="result-card">
                
                <h3>Moisture : {analysisResult.moisture}</h3>
                
              </div>

              <div className="result-card">
                <h3>Fertility : {analysisResult.fertility}</h3>
               
              </div>

              <div className="result-card">
           <h3>Confidence: {(analysisResult.confidence * 100).toFixed(2)}%</h3>
          
         </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}