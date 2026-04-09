import React, { useState, useRef, useEffect } from "react";
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

  const [currentData, setCurrentData] = useState(null);
  const [historyData, setHistoryData] = useState([]);

  const imageInputRef = useRef(null);
  const dataInputRef = useRef(null);

  const fetchData = async () => {
    try {
      const latest = await fetch("http://127.0.0.1:8000/api/soil/latest/");
      const latestData = await latest.json();
      setCurrentData(latestData);

      const history = await fetch("http://127.0.0.1:8000/api/soil/history/");
      const historyRes = await history.json();
      setHistoryData(historyRes);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSampleImageFile(file);
    setSampleImageURL(URL.createObjectURL(file));
  };

  const handleDataFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDataFile(file);
  };

  const handleSubmitTest = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (sampleImageFile) formData.append("image", sampleImageFile);
    if (dataFile) formData.append("data_file", dataFile);
    formData.append("notes", notes);

    try {
      setUploading(true);

      const res = await fetch("http://127.0.0.1:8000/api/soil/upload/", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      setUploadMessage({ type: "success", text: data.message });

      fetchData();

      setSampleImageFile(null);
      setSampleImageURL(null);
      setDataFile(null);
      setNotes("");

    } catch (err) {
      setUploadMessage({ type: "error", text: "Upload failed" });
    }

    setUploading(false);
  };

  return (
    <>
      <Sidebar />

      <div className="soil-dashboard">
        <div className="soil-top-banner">
          <img src={topImage} alt="Soil Testing" className="banner-img" />
          <div className="soil-banner-heading">
            <h1>Professional Soil Testing</h1>
            <p>Accurate analysis for better farming decisions</p>
          </div>
        </div>

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

        <main className="soil-main">

          {/* CURRENT */}
          {activeTab === "current" && (
            <section className="panel">
              <h2>Current Soil Health</h2>

              {currentData && (
                <div className="summary">
                  <div className="score-block">
                    <h3>Soil Score</h3>
                    <p className="score">{currentData.soil_score} / 100</p>
                  </div>

                  <div className="small-stat">
                    <h4>pH</h4>
                    <p>{currentData.ph}</p>
                    <small>{currentData.ph_msg}</small>
                  </div>

                  <div className="small-stat">
                    <h4>Moisture</h4>
                    <p>{currentData.moisture}%</p>
                    <small>{currentData.moisture_msg}</small>
                  </div>
                </div>
              )}

              {currentData && (
                <div className="nutrients">
                  <article className="card">
                    <h4>Nitrogen</h4>
                    <p>{currentData.nitrogen_msg}</p>
                    <b>{currentData.nitrogen} kg/ha</b>
                  </article>

                  <article className="card">
                    <h4>Phosphorus</h4>
                    <p>{currentData.phosphorus_msg}</p>
                    <b>{currentData.phosphorus} kg/ha</b>
                  </article>

                  <article className="card">
                    <h4>Potassium</h4>
                    <p>{currentData.potassium_msg}</p>
                    <b>{currentData.potassium} kg/ha</b>
                  </article>

                  <article className="card">
                    <h4>Organic Matter</h4>
                    <p>{currentData.organic_msg}</p>
                    <b>{currentData.organic_matter}%</b>
                  </article>
                </div>
              )}
            </section>
          )}

          {/* HISTORY */}
          {activeTab === "history" && (
            <section className="panel">
              <h2>History</h2>
              {historyData.map((item, i) => (
                <div key={i} className="card">
                  {item.date} – pH {item.ph} | N {item.nitrogen} | P {item.phosphorus} | K {item.potassium}
                </div>
              ))}
            </section>
          )}

          {/* RECOMMENDATIONS */}
          {activeTab === "recommendations" && (
            <section className="panel">
              <h2>Recommendations</h2>
              <div className="card">
                <ul>
                  {currentData && currentData.ph >= 6 && currentData.ph <= 7 && (
                    <>
                      <li>Wheat</li>
                      <li>Maize</li>
                    </>
                  )}
                  <li>Pulses</li>
                </ul>
              </div>
            </section>
          )}

          {/* NEW TEST */}
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