// frontend/src/pages/SoilAnalysis.jsx
import React, { useState, useRef } from "react";
import "../scss/soilanalysis.scss";
import topImage from "../assets/soil-top.jpg"; // make sure this exists
import Sidebar from "../components/Sidebar"; // adjust if your Sidebar path differs

export default function SoilAnalysis() {
  const [activeTab, setActiveTab] = useState("current");

  // New Test state
  const [sampleImageFile, setSampleImageFile] = useState(null);
  const [sampleImageURL, setSampleImageURL] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const imageInputRef = useRef(null);
  const dataInputRef = useRef(null);

  const handleImageChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(f.type)) {
      setUploadMessage({ type: "error", text: "Image must be JPG/PNG/WEBP." });
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setUploadMessage({ type: "error", text: "Image must be smaller than 5 MB." });
      return;
    }
    setSampleImageFile(f);
    setSampleImageURL(URL.createObjectURL(f));
    setUploadMessage(null);
  };

  const handleDataFileChange = (e) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const ext = (f.name || "").split(".").pop().toLowerCase();
    if (!["csv", "txt"].includes(ext)) {
      setUploadMessage({ type: "error", text: "Data file must be CSV or TXT." });
      return;
    }
    if (f.size > 2 * 1024 * 1024) {
      setUploadMessage({ type: "error", text: "Data file must be smaller than 2 MB." });
      return;
    }
    setDataFile(f);
    setUploadMessage(null);
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();
    if (!sampleImageFile && !dataFile) {
      setUploadMessage({ type: "error", text: "Please attach an image or data file." });
      return;
    }
    setUploading(true);
    setUploadMessage({ type: "info", text: "Uploading (simulated)..." });

    // Simulate upload; replace with real API if available
    setTimeout(() => {
      setUploading(false);
      setUploadMessage({ type: "success", text: "Test submitted (simulated)." });
      setSampleImageFile(null);
      if (sampleImageURL) { URL.revokeObjectURL(sampleImageURL); setSampleImageURL(null); }
      setDataFile(null);
      setNotes("");
      if (imageInputRef.current) imageInputRef.current.value = "";
      if (dataInputRef.current) dataInputRef.current.value = "";
    }, 900);
  };

  return (
    <div className="dashboard-root">
      {/* Sidebar column (always visible) */}
      <aside className="dashboard-sidebar">
        <Sidebar />
      </aside>

      {/* Main content column */}
      <div className="dashboard-main">
        {/* Top hero banner */}
        <div className="soil-top-banner">
          <img className="banner-img" src={topImage} alt="Soil Testing" />
          <div className="soil-banner-heading">
            <h1>Professional Soil Testing</h1>
            <p>Accurate analysis for better farming decisions</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="soil-tabs-container">
          <div className="soil-tabs">
            <button className={activeTab === "current" ? "active" : ""} onClick={() => setActiveTab("current")}>Current Analysis</button>
            <button className={activeTab === "history" ? "active" : ""} onClick={() => setActiveTab("history")}>History</button>
            <button className={activeTab === "recommendations" ? "active" : ""} onClick={() => setActiveTab("recommendations")}>Recommendations</button>
            <button className={activeTab === "new" ? "active" : ""} onClick={() => setActiveTab("new")}>New Test</button>
          </div>
        </div>

        <main className="soil-main">
          {/* Current */}
          {activeTab === "current" && (
            <section className="panel">
              <h2>Current Soil Health</h2>

              <div className="summary">
                <div className="score-block">
                  <h3>Soil Score</h3>
                  <p className="score">78 / 100</p>
                  <div className="progress"><span style={{ width: "78%" }} /></div>
                </div>

                <div className="small-stat">
                  <h4>pH</h4>
                  <p>6.8</p>
                  <small>Near optimal for wheat</small>
                </div>

                <div className="small-stat">
                  <h4>Moisture</h4>
                  <p>18%</p>
                  <small>Good</small>
                </div>

                <div className="small-stat">
                  <p><b>Last test:</b> 15 Mar 2024</p>
                  <p><b>Next check:</b> in 30 days</p>
                </div>
              </div>

              <div className="nutrients">
                <article className="card border-left green">
                  <h4>Nitrogen</h4>
                  <p className="muted">Maintain levels with compost.</p>
                  <p><b>45 kg/ha</b></p>
                </article>

                <article className="card border-left orange">
                  <h4>Phosphorus</h4>
                  <p className="muted">Apply DAP.</p>
                  <p><b>25 kg/ha</b></p>
                </article>

                <article className="card border-left blue">
                  <h4>Potassium</h4>
                  <p className="muted">Healthy level.</p>
                  <p><b>35 kg/ha</b></p>
                </article>

                <article className="card border-left brown">
                  <h4>Organic Matter</h4>
                  <p className="muted">Add compost.</p>
                  <p><b>2.1%</b></p>
                </article>
              </div>
            </section>
          )}

          {/* History */}
          {activeTab === "history" && (
            <section className="panel">
              <h2>History</h2>
              <div className="card">15 Mar 2024 – pH 6.8 | N:45 | P:25 | K:35</div>
              <div className="card">15 Feb 2024 – pH 6.6 | N:42 | P:23 | K:33</div>
              <div className="card">15 Jan 2024 – pH 6.5 | N:40 | P:22 | K:32</div>
            </section>
          )}

          {/* Recommendations */}
          {activeTab === "recommendations" && (
            <section className="panel">
              <h2>Recommendations</h2>
              <div className="card">
                <h4>Suitable Crops</h4>
                <ul>
                  <li>Wheat</li>
                  <li>Maize</li>
                  <li>Pulses</li>
                </ul>
              </div>
            </section>
          )}

          {/* New Test */}
          {activeTab === "new" && (
            <section className="panel new-test-panel">
              <h2>Submit New Soil Test</h2>

              <form className="new-test-form" onSubmit={handleSubmitTest}>
                <div className="form-row">
                  <label>Sample Image (JPG/PNG, &lt;5MB)</label>
                  <input ref={imageInputRef} type="file" accept="image/*" onChange={handleImageChange} />
                </div>

                {sampleImageURL && (
                  <div className="image-preview">
                    <img src={sampleImageURL} alt="Sample preview" />
                    <div className="preview-hint">Preview of selected sample image</div>
                  </div>
                )}

                <div className="form-row">
                  <label>Lab Data (CSV/TXT, &lt;2MB)</label>
                  <input ref={dataInputRef} type="file" accept=".csv,text/csv,text/plain" onChange={handleDataFileChange} />
                  {dataFile && <div className="file-name">Selected: {dataFile.name}</div>}
                </div>

                <div className="form-row">
                  <label>Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Add observations or sample ID..." />
                </div>

                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={uploading}>{uploading ? "Uploading..." : "Submit Test"}</button>
                  <button type="button" className="btn-secondary" onClick={() => {
                    setSampleImageFile(null);
                    if (sampleImageURL) URL.revokeObjectURL(sampleImageURL);
                    setSampleImageURL(null);
                    setDataFile(null);
                    setNotes("");
                    if (imageInputRef.current) imageInputRef.current.value = "";
                    if (dataInputRef.current) dataInputRef.current.value = "";
                    setUploadMessage(null);
                  }}>Reset</button>
                </div>

                {uploadMessage && <div className={`upload-msg ${uploadMessage.type}`}>{uploadMessage.text}</div>}
              </form>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}
