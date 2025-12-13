import React, { useState, useRef } from "react";
import "../scss/soilanalysis.scss";
import topImage from "../assets/soil-top.jpg";
import Sidebar from "../components/Sidebar";

export default function SoilAnalysis() {
  const [activeTab, setActiveTab] = useState("current");

  const [sampleImageFile, setSampleImageFile] = useState(null);
  const [sampleImageURL, setSampleImageURL] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [notes, setNotes] = useState("");
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const imageInputRef = useRef(null);
  const dataInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setUploadMessage({ type: "error", text: "Image must be JPG, PNG, or WEBP." });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage({ type: "error", text: "Image must be under 5MB." });
      return;
    }

    setSampleImageFile(file);
    setSampleImageURL(URL.createObjectURL(file));
    setUploadMessage(null);
  };

  const handleDataFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const ext = file.name.split(".").pop().toLowerCase();
    if (!["csv", "txt"].includes(ext)) {
      setUploadMessage({ type: "error", text: "Only CSV or TXT allowed." });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      setUploadMessage({ type: "error", text: "File must be under 2MB." });
      return;
    }

    setDataFile(file);
    setUploadMessage(null);
  };

  const handleSubmitTest = (e) => {
    e.preventDefault();

    if (!sampleImageFile && !dataFile) {
      setUploadMessage({ type: "error", text: "Attach an image or data file." });
      return;
    }

    setUploading(true);
    setUploadMessage({ type: "info", text: "Uploading (simulated)..." });

    setTimeout(() => {
      setUploading(false);
      setUploadMessage({ type: "success", text: "Test submitted successfully." });

      setSampleImageFile(null);
      if (sampleImageURL) URL.revokeObjectURL(sampleImageURL);
      setSampleImageURL(null);
      setDataFile(null);
      setNotes("");

      if (imageInputRef.current) imageInputRef.current.value = "";
      if (dataInputRef.current) dataInputRef.current.value = "";
    }, 900);
  };

  return (
    <>
      {/* ✅ SAME AS WEATHER */}
      <Sidebar />

      {/* ✅ CONTENT STARTS AFTER SIDEBAR */}
      <div className="soil-dashboard">
        {/* HERO */}
        <div className="soil-top-banner">
          <img src={topImage} alt="Soil Testing" className="banner-img" />
          <div className="soil-banner-heading">
            <h1>Professional Soil Testing</h1>
            <p>Accurate analysis for better farming decisions</p>
          </div>
        </div>

        {/* TABS */}
        <div className="soil-tabs-container">
          <div className="soil-tabs">
            {["current", "history", "recommendations", "new"].map((tab) => (
              <button
                key={tab}
                className={activeTab === tab ? "active" : ""}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "current" && "Current Analysis"}
                {tab === "history" && "History"}
                {tab === "recommendations" && "Recommendations"}
                {tab === "new" && "New Test"}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        <main className="soil-main">
          {activeTab === "current" && (
            <section className="panel">
              <h2>Current Soil Health</h2>

              <div className="summary">
                <div className="score-block">
                  <h3>Soil Score</h3>
                  <p className="score">78 / 100</p>
                  <div className="progress">
                    <span style={{ width: "78%" }} />
                  </div>
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
                  <p>Maintain levels with compost.</p>
                  <b>45 kg/ha</b>
                </article>

                <article className="card border-left orange">
                  <h4>Phosphorus</h4>
                  <p>Apply DAP.</p>
                  <b>25 kg/ha</b>
                </article>

                <article className="card border-left blue">
                  <h4>Potassium</h4>
                  <p>Healthy level.</p>
                  <b>35 kg/ha</b>
                </article>

                <article className="card border-left brown">
                  <h4>Organic Matter</h4>
                  <p>Add compost.</p>
                  <b>2.1%</b>
                </article>
              </div>
            </section>
          )}

          {activeTab === "history" && (
            <section className="panel">
              <h2>History</h2>
              <div className="card">15 Mar 2024 – pH 6.8 | N 45 | P 25 | K 35</div>
              <div className="card">15 Feb 2024 – pH 6.6 | N 42 | P 23 | K 33</div>
              <div className="card">15 Jan 2024 – pH 6.5 | N 40 | P 22 | K 32</div>
            </section>
          )}

          {activeTab === "recommendations" && (
            <section className="panel">
              <h2>Recommendations</h2>
              <div className="card">
                <ul>
                  <li>Wheat</li>
                  <li>Maize</li>
                  <li>Pulses</li>
                </ul>
              </div>
            </section>
          )}

          {activeTab === "new" && (
            <section className="panel new-test-panel">
              <h2>Submit New Soil Test</h2>

              <form className="new-test-form" onSubmit={handleSubmitTest}>
                <div className="form-row">
                  <label>Sample Image</label>
                  <input ref={imageInputRef} type="file" onChange={handleImageChange} />
                </div>

                {sampleImageURL && (
                  <div className="image-preview">
                    <img src={sampleImageURL} alt="Preview" />
                  </div>
                )}

                <div className="form-row">
                  <label>Lab Data</label>
                  <input ref={dataInputRef} type="file" onChange={handleDataFileChange} />
                </div>

                <div className="form-row">
                  <label>Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>

                <div className="form-actions">
                  <button className="btn-primary" disabled={uploading}>
                    {uploading ? "Uploading..." : "Submit Test"}
                  </button>
                </div>

                {uploadMessage && (
                  <div className={`upload-msg ${uploadMessage.type}`}>
                    {uploadMessage.text}
                  </div>
                )}
              </form>
            </section>
          )}
        </main>
      </div>
    </>
  );
}
