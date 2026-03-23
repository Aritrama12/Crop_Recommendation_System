import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../scss/settings.scss";
import axios from "axios";
import { useEffect } from "react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("notifications");

  const [notifications, setNotifications] = useState({
  weather_alerts: false,
  crop_recommendations: false,
  soil_analysis: false,
  market_prices: false,

  location_access: false,
  share_analytics: false,
});



useEffect(() => {
  const token = localStorage.getItem("access");

  axios
    .get("http://127.0.0.1:8000/api/notifications/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      setNotifications(res.data);
    })
    .catch((err) => console.error(err));
}, []);




const handleToggle = async (field) => {
  const updatedValue = !notifications[field];
  const token = localStorage.getItem("access");

  // instant UI update
  setNotifications((prev) => ({
    ...prev,
    [field]: updatedValue,
  }));

  try {
    await axios.patch(
      "http://127.0.0.1:8000/api/notifications/",
      {
        [field]: updatedValue,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.error(err);

    // rollback if API fails
    setNotifications((prev) => ({
      ...prev,
      [field]: !updatedValue,
    }));
  }
};







  return (
    <>
      <Sidebar />
      <div className="settings">

        {/* Header */}
        <h1 className="settings-title">Settings</h1>
        <p className="settings-subtitle">
          Customize your CropWise experience and manage your preferences
        </p>

        {/* Tabs */}
        <div className="settings-tabs">
          {[
            "notifications",
            "privacy",
            "preferences",
            "data",
            "account",
          ].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? "active" : ""}`}
            >
              {tab === "notifications" && "Notifications"}
              {tab === "privacy" && "Privacy"}
              {tab === "preferences" && "Preferences"}
              {tab === "data" && "Data & Export"}
              {tab === "account" && "Account"}
            </div>
          ))}
        </div>

        {/* ==========================
            NOTIFICATIONS
        =========================== */}
        {activeTab === "notifications" && (
          <div className="settings-card fadeIn">
            <h2 className="section-title">Notification Preferences</h2>
            <p className="section-subtext">
              Choose what notifications you want to receive
            </p>

            {[
              {
                key: "weather_alerts",
                title: "Weather Alerts",
                text: "Get notified about weather changes that may affect your crops",
              },
              {
                key: "crop_recommendations",
                title: "Crop Recommendations",
                text: "Notifications about new crop recommendations",
              },
              {
                key: "soil_analysis",
                title: "Soil Analysis",
                text: "Get notified when soil test results are available",
              },
              {
                key: "market_prices",
                title: "Market Prices",
                text: "Stay updated on crop prices and market trends",
              },
            ].map((item, i) => (
              <div className="setting-item" key={i}>
                <div>
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
                <label className="switch">
                  <input
                    type="checkbox"
                    checked={notifications[item.key] || false}
                    onChange={() => handleToggle(item.key)}
                  />
                  <span></span>
                </label>
              </div>
            ))}
          </div>
        )}

        {/* ==========================
            PRIVACY
        =========================== */}
          {activeTab === "privacy" && (
            <div className="settings-card fadeIn">
              <h2 className="section-title">Privacy Controls</h2>
              <p className="section-subtext">
                Manage your privacy and data sharing preferences
              </p>

              {[
                {
                  key: "location_access",
                  title: "Location Access",
                  text: "Allow app to access your device location for accurate results",
                },
                {
                  key: "share_analytics",
                  title: "Share Analytics",
                  text: "Allow anonymous usage data to improve product features",
                },
              ].map((item, i) => (
                <div className="setting-item" key={i}>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                  <label className="switch">
                    <input
                      type="checkbox"
                      checked={notifications[item.key] || false}
                      onChange={() => handleToggle(item.key)}
                    />
                    <span></span>
                  </label>
                </div>
              ))}
            </div>
          )}

        {/* ==========================
            PREFERENCES
        =========================== */}
        {activeTab === "preferences" && (
          <div className="settings-card fadeIn">
            <h2 className="section-title">App Preferences</h2>
            <p className="section-subtext">
              Customize your app experience
            </p>

            <div className="preferences-grid">

              {/* Theme */}
              <div className="form-group">
                <label>Theme</label>
                <select>
                  <option>System</option>
                  <option>Light</option>
                  <option>Dark</option>
                </select>
              </div>

              {/* Units */}
              <div className="form-group">
                <label>Measurement Units</label>
                <select>
                  <option>Metric (kg, hectare, Celsius)</option>
                  <option>Imperial (lbs, acres, Fahrenheit)</option>
                </select>
              </div>

              {/* Language */}
              <div className="form-group">
                <label>Language</label>
                <select>
                  <option>English</option>
                  <option>Hindi</option>
                  <option>Bengali</option>
                </select>
              </div>

              {/* Timezone */}
              <div className="form-group">
                <label>Timezone</label>
                <select>
                  <option>Asia/Kolkata (GMT+5:30)</option>
                </select>
              </div>

              {/* Currency */}
              <div className="form-group">
                <label>Currency</label>
                <select>
                  <option>₹ Indian Rupee (INR)</option>
                </select>
              </div>

            </div>
          </div>
        )}

        {/* ==========================
            DATA & EXPORT
        =========================== */}
        {activeTab === "data" && (
          <div className="settings-card fadeIn">

            <h2 className="section-title">Data Export</h2>
            <p className="section-subtext">
              Download your farming data and reports
            </p>

            <div className="export-grid">

              <div className="export-box">
                <h3>Complete Data Export</h3>
                <p>Download all your farming data including analytics & reports</p>
                <button className="primary-btn">Export All Data</button>
              </div>

              <div className="export-box">
                <h3>Selective Export</h3>
                <p>Choose specific data categories</p>
                <button className="secondary-btn">Choose Data</button>
              </div>

            </div>

            <h2 className="section-title" style={{ marginTop: "2rem" }}>
              Data Storage
            </h2>
            <p className="section-subtext">
              Information about your data storage and retention
            </p>

            <div className="stats-grid">
              <div className="stat-card">
                <h1>2.4 GB</h1>
                <p>Total Data</p>
              </div>
              <div className="stat-card">
                <h1>4 Years</h1>
                <p>Data Retention</p>
              </div>
              <div className="stat-card">
                <h1>24 Hrs</h1>
                <p>Backup Frequency</p>
              </div>
            </div>
          </div>
        )}

        {/* ==========================
            ACCOUNT
        =========================== */}
        {activeTab === "account" && (
          <div className="settings-card fadeIn">
            <h2 className="section-title">Account Management</h2>
            <p className="section-subtext">
              Manage your account settings and preferences
            </p>

            <form className="account-form">
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" placeholder="Enter current password" />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input type="password" placeholder="Enter new password" />
              </div>

              <div className="form-group">
                <label>Confirm New Password</label>
                <input type="password" placeholder="Confirm new password" />
              </div>

              <button className="primary-btn">Update Password</button>
            </form>

            <div className="danger-zone">
              <h2>Danger Zone</h2>
              <p>
                Deleting your account is irreversible. All your data will be lost.
              </p>
              <button className="danger-btn">Delete Account</button>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
