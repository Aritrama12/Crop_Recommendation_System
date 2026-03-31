// import React, { useState, useRef } from "react";
// import "../scss/soilanalysis.scss";
// import topImage from "../assets/soil-top.jpg";
// import Sidebar from "../components/Sidebar";

// export default function SoilAnalysis() {
//   const [activeTab, setActiveTab] = useState("current");

//   const [sampleImageFile, setSampleImageFile] = useState(null);
//   const [sampleImageURL, setSampleImageURL] = useState(null);
//   const [dataFile, setDataFile] = useState(null);
//   const [notes, setNotes] = useState("");
//   const [uploadMessage, setUploadMessage] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   const imageInputRef = useRef(null);
//   const dataInputRef = useRef(null);

//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
//       setUploadMessage({ type: "error", text: "Image must be JPG, PNG, or WEBP." });
//       return;
//     }

//     if (file.size > 5 * 1024 * 1024) {
//       setUploadMessage({ type: "error", text: "Image must be under 5MB." });
//       return;
//     }

//     setSampleImageFile(file);
//     setSampleImageURL(URL.createObjectURL(file));
//     setUploadMessage(null);
//   };

//   const handleDataFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (!file) return;

//     const ext = file.name.split(".").pop().toLowerCase();
//     if (!["csv", "txt"].includes(ext)) {
//       setUploadMessage({ type: "error", text: "Only CSV or TXT allowed." });
//       return;
//     }

//     if (file.size > 2 * 1024 * 1024) {
//       setUploadMessage({ type: "error", text: "File must be under 2MB." });
//       return;
//     }

//     setDataFile(file);
//     setUploadMessage(null);
//   };

//   const handleSubmitTest = (e) => {
//     e.preventDefault();

//     if (!sampleImageFile && !dataFile) {
//       setUploadMessage({ type: "error", text: "Attach an image or data file." });
//       return;
//     }

//     setUploading(true);
//     setUploadMessage({ type: "info", text: "Uploading (simulated)..." });

//     setTimeout(() => {
//       setUploading(false);
//       setUploadMessage({ type: "success", text: "Test submitted successfully." });

//       setSampleImageFile(null);
//       if (sampleImageURL) URL.revokeObjectURL(sampleImageURL);
//       setSampleImageURL(null);
//       setDataFile(null);
//       setNotes("");

//       if (imageInputRef.current) imageInputRef.current.value = "";
//       if (dataInputRef.current) dataInputRef.current.value = "";
//     }, 900);
//   };

//   return (
//     <>
//       {/* ✅ SAME AS WEATHER */}
//       <Sidebar />

//       {/* ✅ CONTENT STARTS AFTER SIDEBAR */}
//       <div className="soil-dashboard">
//         {/* HERO */}
//         <div className="soil-top-banner">
//           <img src={topImage} alt="Soil Testing" className="banner-img" />
//           <div className="soil-banner-heading">
//             <h1>Professional Soil Testing</h1>
//             <p>Accurate analysis for better farming decisions</p>
//           </div>
//         </div>

//         {/* TABS */}
//         <div className="soil-tabs-container">
//           <div className="soil-tabs">
//             {["current", "history", "recommendations", "new"].map((tab) => (
//               <button
//                 key={tab}
//                 className={activeTab === tab ? "active" : ""}
//                 onClick={() => setActiveTab(tab)}
//               >
//                 {tab === "current" && "Current Analysis"}
//                 {tab === "history" && "History"}
//                 {tab === "recommendations" && "Recommendations"}
//                 {tab === "new" && "New Test"}
//               </button>
//             ))}
//           </div>
//         </div>

//         {/* CONTENT */}
//         <main className="soil-main">
//           {activeTab === "current" && (
//             <section className="panel">
//               <h2>Current Soil Health</h2>

//               <div className="summary">
//                 <div className="score-block">
//                   <h3>Soil Score</h3>
//                   <p className="score">78 / 100</p>
//                   <div className="progress">
//                     <span style={{ width: "78%" }} />
//                   </div>
//                 </div>

//                 <div className="small-stat">
//                   <h4>pH</h4>
//                   <p>6.8</p>
//                   <small>Near optimal for wheat</small>
//                 </div>

//                 <div className="small-stat">
//                   <h4>Moisture</h4>
//                   <p>18%</p>
//                   <small>Good</small>
//                 </div>

//                 <div className="small-stat">
//                   <p><b>Last test:</b> 15 Mar 2024</p>
//                   <p><b>Next check:</b> in 30 days</p>
//                 </div>
//               </div>

//               <div className="nutrients">
//                 <article className="card border-left green">
//                   <h4>Nitrogen</h4>
//                   <p>Maintain levels with compost.</p>
//                   <b>45 kg/ha</b>
//                 </article>

//                 <article className="card border-left orange">
//                   <h4>Phosphorus</h4>
//                   <p>Apply DAP.</p>
//                   <b>25 kg/ha</b>
//                 </article>

//                 <article className="card border-left blue">
//                   <h4>Potassium</h4>
//                   <p>Healthy level.</p>
//                   <b>35 kg/ha</b>
//                 </article>

//                 <article className="card border-left brown">
//                   <h4>Organic Matter</h4>
//                   <p>Add compost.</p>
//                   <b>2.1%</b>
//                 </article>
//               </div>
//             </section>
//           )}

//           {activeTab === "history" && (
//             <section className="panel">
//               <h2>History</h2>
//               <div className="card">15 Mar 2024 – pH 6.8 | N 45 | P 25 | K 35</div>
//               <div className="card">15 Feb 2024 – pH 6.6 | N 42 | P 23 | K 33</div>
//               <div className="card">15 Jan 2024 – pH 6.5 | N 40 | P 22 | K 32</div>
//             </section>
//           )}

//           {activeTab === "recommendations" && (
//             <section className="panel">
//               <h2>Recommendations</h2>
//               <div className="card">
//                 <ul>
//                   <li>Wheat</li>
//                   <li>Maize</li>
//                   <li>Pulses</li>
//                 </ul>
//               </div>
//             </section>
//           )}

//           {activeTab === "new" && (
//             <section className="panel new-test-panel">
//               <h2>Submit New Soil Test</h2>

//               <form className="new-test-form" onSubmit={handleSubmitTest}>
//                 <div className="form-row">
//                   <label>Sample Image</label>
//                   <input ref={imageInputRef} type="file" onChange={handleImageChange} />
//                 </div>

//                 {sampleImageURL && (
//                   <div className="image-preview">
//                     <img src={sampleImageURL} alt="Preview" />
//                   </div>
//                 )}

//                 <div className="form-row">
//                   <label>Lab Data</label>
//                   <input ref={dataInputRef} type="file" onChange={handleDataFileChange} />
//                 </div>

//                 <div className="form-row">
//                   <label>Notes</label>
//                   <textarea value={notes} onChange={(e) => setNotes(e.target.value)} />
//                 </div>

//                 <div className="form-actions">
//                   <button className="btn-primary" disabled={uploading}>
//                     {uploading ? "Uploading..." : "Submit Test"}
//                   </button>
//                 </div>

//                 {uploadMessage && (
//                   <div className={`upload-msg ${uploadMessage.type}`}>
//                     {uploadMessage.text}
//                   </div>
//                 )}
//               </form>
//             </section>
//           )}
//         </main>
//       </div>
//     </>
//   );
// }



import React, { useState, useRef } from "react";
import "../scss/soilanalysis.scss";
import topImage from "../assets/soil-top.jpg";
import Sidebar from "../components/Sidebar";

export default function SoilAnalysis() {
  const [activeTab, setActiveTab] = useState("current");

  const [sampleImageFile, setSampleImageFile] = useState(null);
  const [sampleImageURL, setSampleImageURL] = useState(null);
  const [dataFile, setDataFile] = useState(null);
  const [uploadMessage, setUploadMessage] = useState(null);
  const [uploading, setUploading] = useState(false);

//  New state for test mode toggle
  const [testMode, setTestMode] = useState("free");

  const imageInputRef = useRef(null);
  const dataInputRef = useRef(null);

  //  Tabs config
  const tabs = {
    current: "Current Analysis",
    history: "History",
    recommendations: "Recommendations",
    new: "New Test",
  };

  //  Validation helpers
  const isValidImage = (file) =>
    ["image/jpeg", "image/png", "image/webp"].includes(file.type) &&
    file.size <= 5 * 1024 * 1024;

  const isValidDataFile = (file) => {
    const ext = file.name.split(".").pop().toLowerCase();
    return ["csv", "txt"].includes(ext) && file.size <= 2 * 1024 * 1024;
  };

  //  Unified file handler
  const handleFileChange = (e, type) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "image") {
      if (!isValidImage(file)) {
        setUploadMessage({ type: "error", text: "Invalid image (type/size)." });
        return;
      }
      setSampleImageFile(file);
      setSampleImageURL(URL.createObjectURL(file));
    }

    if (type === "data") {
      if (!isValidDataFile(file)) {
        setUploadMessage({ type: "error", text: "Invalid data file." });
        return;
      }
      setDataFile(file);
    }

    setUploadMessage(null);
  };

  //  Reset form
  const resetForm = () => {
    setSampleImageFile(null);
    setDataFile(null);
  

    if (sampleImageURL) URL.revokeObjectURL(sampleImageURL);
    setSampleImageURL(null);

    if (imageInputRef.current) imageInputRef.current.value = "";
    if (dataInputRef.current) dataInputRef.current.value = "";
  };

  //  Submit handler
  const handleSubmitTest = (e) => {
    e.preventDefault();

    const hasUpload = sampleImageFile || dataFile;

    if (!hasUpload) {
      setUploadMessage({ type: "error", text: "Attach an image or data file." });
      return;
    }

    setUploading(true);
    setUploadMessage({ type: "info", text: "Uploading (simulated)..." });

    setTimeout(() => {
      setUploading(false);
      setUploadMessage({ type: "success", text: "Test submitted successfully." });
      resetForm();
    }, 900);
  };

  return (
    <>
      <Sidebar />

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
            {Object.entries(tabs).map(([key, label]) => (
              <button
                key={key}
                className={activeTab === key ? "active" : ""}
                onClick={() => setActiveTab(key)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        
        <main className="soil-main">

          {/* current analysis */}
           {activeTab === "current" && (
            <section className="panel modern-current">
              <h2>Current Soil Health</h2>


               {/* SOIL SCORE */}
              <div className="score-box">
                <h3>Soil Score</h3>
                <div className="score-circle">
                  <div style={{ width: "78%" }} />
                </div>
                <p>78 / 100</p>
              </div>

              {/* TOP METRICS */}
              <div className="top-cards">
                <div className="metric-card">
                  <span className="icon">🧪</span>
                  <h3>6.8</h3>
                  <p>pH Level</p>
                  <span className="tag">Optimal</span>
                </div>

                <div className="metric-card">
                  <span className="icon">🌿</span>
                  <h3>45</h3>
                  <p>Nitrogen (kg/ha)</p>
                  <span className="tag">Good</span>
                </div>

                <div className="metric-card">
                  <span className="icon">💧</span>
                  <h3>18%</h3>
                  <p>Moisture</p>
                  <span className="tag">Normal</span>
                </div>

                <div className="metric-card">
                  <span className="icon">⚗️</span>
                  <h3>2.1%</h3>
                  <p>Organic Matter</p>
                  <span className="tag">Low</span>
                </div>
              </div>

             

              {/* LOWER GRID */}
              <div className="bottom-grid">
                {/* Nutrients */}
                <div className="info-card">
                  <h3>Nutrient Levels</h3>
                  <p className="sub">Current soil nutrient composition</p>

                  {/* ===== Progress Row ===== */}
                  <div className="progress-row">
                    <div className="top">
                      <span>Nitrogen (N)</span>
                      <b>45 kg/ha</b>
                    </div>

                    <div className="bar">
                      <div style={{ width: "75%" }}></div> {/* dynamic width */}
                    </div>
                  </div>

                  <div className="progress-row">
                    <div className="top">
                      <span>Phosphorus (P)</span>
                      <b>25 kg/ha</b>
                    </div>

                    <div className="bar">
                      <div style={{ width: "60%" }} />
                      </div>
                  </div>

                  <div className="progress-row">
                    <div className="top">
                      <span>Potassium (K)</span>
                      <b>35 kg/ha</b>
                    </div>

                    <div className="bar">
                      <div style={{ width: "70%" }} />
                      </div>
                  </div>

                  <div className="progress-row">
                    <div className="top">
                      <span>Organic Matter</span>
                      <b>2.1%</b>
                    </div>

                    <div className="bar">
                      <div style={{ width: "40%" }} />
                      </div>
                  </div>
                </div>

                {/* Physical Properties */}
                <div className="info-card">
                  <h3>Physical Properties</h3>
                  <p className="sub">Soil structure and conditions</p>

                  <div className="prop">
                    <span>pH Level</span>
                    <div className="right">
                      <b>6.8</b>
                      <p className="green">Slightly Acidic</p>
                    </div>
                  </div>

                  <div className="prop">
                    <span>Moisture</span>
                    <div className="right">
                      <b>18%</b>
                      <p className="blue">Adequate</p>
                    </div>
                  </div>

                  <div className="prop">
                    <span>Temperature</span>
                    <div className="right">
                      <b>24°C</b>
                      <p className="orange">Optimal</p>
                    </div>
                  </div>

                  <div className="prop">
                    <span>Conductivity</span>
                    <div className="right">
                      <b>0.8 dS/m</b>
                      <p className="green">Normal</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}



          {/* history */}
            {activeTab === "history" && (
              <section className="panel history-panel">
                <div className="history-header">
                  <h2>Soil Analysis History</h2>
                  <p>Track changes in soil composition over time</p>
                </div>

                <div className="history-list">
                  {[
                    {
                      date: "1/15/2024",
                      test: "Test #1",
                      pH: 6.5,
                      N: 40,
                      P: 22,
                      K: 32,
                      organic: "1.9%",
                    },
                    {
                      date: "2/15/2024",
                      test: "Test #2",
                      pH: 6.6,
                      N: 42,
                      P: 23,
                      K: 33,
                      organic: "2%",
                    },
                    {
                      date: "3/15/2024",
                      test: "Test #3",
                      pH: 6.8,
                      N: 45,
                      P: 25,
                      K: 35,
                      organic: "2.1%",
                    },
                  ].map((item, i) => (
                    <div key={i} className="history-card">
                      <div className="history-top">
                        <div className="date">
                          📅 <span>{item.date}</span>
                        </div>
                        <div className="badge">{item.test}</div>
                      </div>

                      <div className="history-metrics">
                        <div>
                          <p>pH</p>
                          <h4>{item.pH}</h4>
                        </div>

                        <div>
                          <p>Nitrogen</p>
                          <h4>{item.N} kg/ha</h4>
                        </div>

                        <div>
                          <p>Phosphorus</p>
                          <h4>{item.P} kg/ha</h4>
                        </div>

                        <div>
                          <p>Potassium</p>
                          <h4>{item.K} kg/ha</h4>
                        </div>

                        <div>
                          <p>Organic Matter</p>
                          <h4>{item.organic}</h4>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* recommendations */}
            {activeTab === "recommendations" && (
              <section className="panel recommendations-panel">
                <h2>Soil Recommendations</h2>

                <div className="recommendation-list">
                  {[
                    {
                      title: "Nitrogen",
                      desc: "Maintain current levels with organic compost",
                      value: "45 kg/ha",
                      status: "good",
                      priority: "low",
                    },
                    {
                      title: "Phosphorus",
                      desc: "Apply DAP fertilizer - 50kg per hectare",
                      value: "25 kg/ha",
                      status: "low",
                      priority: "medium",
                    },
                    {
                      title: "Potassium",
                      desc: "Consider potash application before next season",
                      value: "35 kg/ha",
                      status: "warning",
                      priority: "low",
                    },
                    {
                      title: "pH Level",
                      desc: "Perfect for most crops. No adjustment needed",
                      value: "6.8",
                      status: "good",
                      priority: "low",
                    },
                  ].map((item, i) => (
                    <div key={i} className="recommendation-card">
                      
                      {/* LEFT */}
                      <div className="rec-left">
                        <div className={`iconn ${item.status}`}>
                          {item.status === "good" && "✔"}
                          {item.status === "low" && "!"}
                          {item.status === "warning" && "⚠"}
                        </div>

                        <div className="rec-content">
                          <h3>{item.title}</h3>
                          <p>{item.desc}</p>

                          <div className="current">
                            Current:
                            <span className={`value ${item.status}`}>
                              {item.value}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* RIGHT */}
                      <div className={`priority ${item.priority}`}>
                        {item.priority} priority
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}


          {/* new test form */}


          {activeTab === "new" && (
            <section className="panel new-test-panel">
              <h2>Submit New Soil Test</h2>

              {/* TOGGLE */}
              <div className="test-type-toggle">
                <button
                  className={testMode === "free" ? "active" : ""}
                  onClick={() => setTestMode("free")}
                  type="button"
                >
                  Free Quick Test
                </button>

                <button
                  className={testMode === "paid" ? "active" : ""}
                  onClick={() => setTestMode("paid")}
                  type="button"
                >
                  Book Professional Test
                </button>
              </div>

              {/*  FREE TEST  */}
              {testMode === "free" && (
                <form className="new-test-form" onSubmit={handleSubmitTest}>
                  
                  {/* Image Upload */}
                  <div className="form-row">
                    <label>Upload Soil Image *</label>
                    <input
                      ref={imageInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, "image")}
                      required
                    />
                  </div>

                  {sampleImageURL && (
                    <div className="image-preview">
                      <img src={sampleImageURL} alt="Preview" />
                    </div>
                  )}

                  {/* FORM GRID */}
                  <div className="form-grid">

                    <div className="form-row">
                      <label>Location</label>
                      <input type="text" placeholder="e.g. West Bengal" />
                    </div>

                    <div className="form-row">
                      <label>Temperature (°C)</label>
                      <input type="number" placeholder="e.g. 28" />
                    </div>

                    <div className="form-row">
                      <label>Moisture (%)</label>
                      <input type="number" placeholder="e.g. 60" />
                    </div>

                    <div className="form-row">
                      <label>Rainfall (mm)</label>
                      <input type="number" placeholder="e.g. 120" />
                    </div>

                    {/* <div className="form-row">
                      <label>Soil Type</label>
                      <select>
                        <option>Loamy</option>
                        <option>Sandy</option>
                        <option>Clay</option>
                        <option>Silty</option>
                      </select>
                    </div> */}

                  </div>

                  <div className="form-actions">
                    <button className="btn-primary" disabled={uploading}>
                      {uploading ? "Analyzing..." : "Submit Free Test"}
                    </button>
                  </div>

                  {uploadMessage && (
                    <div className={`upload-msg ${uploadMessage.type}`}>
                      {uploadMessage.text}
                    </div>
                  )}
                </form>
              )}

              {/*  PAID TEST  */}
              {testMode === "paid" && (
                <form className="paid-test-form">
                  <div className="form-grid">
                    <div className="form-row">
                      <label>Farm Location</label>
                      <input type="text" placeholder="Enter farm address" />
                    </div>

                    <div className="form-row">
                      <label>Area to Test (hectares)</label>
                      <input type="number" placeholder="e.g. 5" />
                    </div>

                    <div className="form-row">
                      <label>Preferred Test Date</label>
                      <input type="date" />
                    </div>

                    <div className="form-row">
                      <label>Test Type</label>
                      <select>
                        <option>Basic Nutrient Analysis</option>
                        <option>Comprehensive Soil Health</option>
                        <option>Organic Matter & pH Only</option>
                        <option>Heavy Metals Testing</option>
                      </select>
                    </div>
                  </div>

                  {/* Upload Section */}
                  <div className="upload-box">
                    <p>Upload Soil Samples Photos (optional)</p>
                    <input type="file" />
                  </div>

                  <div className="form-actions">
                    <button className="btn-primary">
                      Schedule Soil Test - ₹2,500
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}



        </main>
      </div>
    </>
  );
}