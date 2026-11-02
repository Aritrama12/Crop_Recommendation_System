import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../scss/settings.scss";
import axios from "axios";
import { useEffect } from "react";
import { settingsAPI } from "../api/settingsAPI";
import toast from "react-hot-toast";
import { useTheme } from "../context/ThemeContext";
import { useTranslation } from "react-i18next"; // for language translation
export default function Settings() {

  const [activeTab, setActiveTab] = useState("notifications");
  const [locationPermission, setLocationPermission] = useState("unknown");

  const [notifications, setNotifications] = useState({
  weather_alerts: false,
  crop_recommendations: false,
  soil_analysis: false,
  market_prices: false,

  location_access: false,
  share_analytics: false,
});
const {t , i18n} = useTranslation();
const { toggleTheme } = useTheme();
//preferences default
const [preferences, setPreferences] = useState({
  theme: "light",
  measurement_unit: "metric",
  language: "english",
  timezone: "Asia/Kolkata",
  currency: "INR",
});

// preferences

useEffect(() => {
  loadPreferences();
}, []);

// const loadPreferences = async () => {
//   try {
//     const res = await settingsAPI.getPreferences();
//     setPreferences(res.data);
//   } catch (err) {
//     console.log(err);
//   }
// };

// const handlePreferenceChange = async (e) => {
//   const { name, value } = e.target;

//   const updated = {
//     ...preferences,
//     [name]: value,
//   };

//   setPreferences(updated);

//   // change theme instantly
//   if (name === "theme") {
//     toggleTheme(value);
//   }

//   try {
//     await settingsAPI.updatePreferences(updated);
//     toast.success("Updated");
//   } catch {
//     toast.error("Update failed");
//   }
// };



// location permission status

const loadPreferences = async () => {
  try {
    const res = await settingsAPI.getPreferences();

    setPreferences(res.data);

    // Apply saved theme
    if (res.data.theme) {
      toggleTheme(res.data.theme);
    }

    // Apply saved language
    if (res.data.language) {
      i18n.changeLanguage(res.data.language);
      localStorage.setItem("language", res.data.language);
    }
  } catch (err) {
    console.log(err);
  }
};
const handlePreferenceChange = async (e) => {
  const { name, value } = e.target;

  const updated = {
    ...preferences,
    [name]: value,
  };

  setPreferences(updated);

  if (name === "theme") {
    toggleTheme(value);
  }

  if (name === "language") {
    i18n.changeLanguage(value);
    localStorage.setItem("language", value);
  }

  try {
    await settingsAPI.updatePreferences(updated);
    toast.success("Updated");
  } catch {
    toast.error("Update failed");
  }
};

useEffect(() => {
  if (!navigator.permissions) return;

  navigator.permissions
    .query({ name: "geolocation" })
    .then((result) => {
      setLocationPermission(result.state);

      result.onchange = () => {
        setLocationPermission(result.state);
      };
    });
}, []);


// gets user location and saves to database
const saveLocation = async (latitude, longitude) => {
  const token = localStorage.getItem("access");

  try {
    await axios.patch(
      "https://cropwise-backend1.onrender.com/api/settings/location/",
      {
        latitude,
        longitude,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.log(err);
  }
};


useEffect(() => {
  if (!notifications.location_access) return;

  if (!navigator.geolocation) {
    toast.error("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (position) => {
      saveLocation(
        position.coords.latitude,
        position.coords.longitude
      );
    },
    () => {
      toast.error(
        "Location blocked in browser settings."
      );
    }
  );
}, [notifications.location_access]);




//notification
useEffect(() => {
  const token = localStorage.getItem("access");

  axios
    .get("https://cropwise-backend1.onrender.com/api/settings/notifications-settings/", {
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
      "https://cropwise-backend1.onrender.com/api/settings/notifications-settings/",
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



//change password
const [passwordData, setPasswordData] = useState({
  current_password: "",
  new_password: "",
  confirm_password: "",
});
const handlePasswordChange = (e) => {
  const { name, value } = e.target;

  setPasswordData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

const handleUpdatePassword = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("access");

  try {
    // await axios.post(
    //   "http://127.0.0.1:8000/api/settings/change-password/",
    //   passwordData,
    //   {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //     },
    //   }
    // );
    await settingsAPI.changePassword(passwordData);
    toast.success("Password updated successfully");

    setPasswordData({
      current_password: "",
      new_password: "",
      confirm_password: "",
    });

  } catch (err) {

    if (err.response?.data) {

      const errors = err.response.data;

      Object.values(errors).forEach((value) => {
        toast.error(
          Array.isArray(value) ? value[0] : value
        );
      });

    } else {
      toast.error("Something went wrong");
    }
  }
};



  return (
    <>
      <Sidebar />
      <div className="settings">

        {/* Header */}
        <h1 className="settings-title">{t("settings")}</h1>

<p className="settings-subtitle">
{t("settings_subtitle")}
</p>

        {/* Tabs */}
        <div className="settings-tabs">
          {[
            "notifications",
            "privacy",
            "preferences",
            // "data",
            "account",
          ].map((tab) => (
            <div
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`tab ${activeTab === tab ? "active" : ""}`}
            >
             {tab === "notifications" && t("notifications")}
{tab === "privacy" && t("privacy")}
{tab === "preferences" && t("preferences")}
{tab === "data" && t("data_export")}
{tab === "account" && t("account")}
            </div>
          ))}
        </div>

        {/* ==========================
            NOTIFICATIONS
        =========================== */}
        {activeTab === "notifications" && (
          <div className="settings-card fadeIn">
            <h2 className="section-title">{t("notification_preferences")}</h2>
            <p className="section-subtext">
             {t("notification_preferences_desc")}
            </p>

            {[
              {
    key: "weather_alerts",
    title: t("weather_alerts"),
    text: t("weather_alerts_desc"),
  },
  // {
  //   key: "systemknowledge_updates",
  //   title: t("system_announcements"),
  //   text: t("system_announcements_desc"),
  // },
  // {
  //   key: "market_prices",
  //   title: t("market_prices"),
  //   text: t("market_prices_desc"),
  // },
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
    <h2 className="section-title">
      {t("privacy_controls")}
    </h2>

    <p className="section-subtext">
      {t("privacy_controls_desc")}
    </p>

    {[
      {
        key: "location_access",
        title: t("location_access"),
        text: t("location_access_desc"),
      },
      {
        key: "share_analytics",
        title: t("share_analytics"),
        text: t("share_analytics_desc"),
      },
    ].map((item, i) => (
      <div className="setting-item" key={i}>
        <div>
          <h3>{item.title}</h3>
          <p>{item.text}</p>

          {item.key === "location_access" && (
            <>
              {locationPermission === "granted" && (
                <small className="permission-success">
                  {t("browser_location_granted")}
                </small>
              )}

              {locationPermission === "denied" && (
                <small className="permission-warning">
                  {t("browser_location_denied")}
                </small>
              )}

              {locationPermission === "prompt" && (
                <small className="permission-info">
                  {t("browser_location_prompt")}
                </small>
              )}
            </>
          )}
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
    <h2 className="section-title">
      {t("app_preferences")}
    </h2>

    <p className="section-subtext">
      {t("app_preferences_desc")}
    </p>

    <div className="preferences-grid">

      {/* Theme */}
      <div className="form-group">
        <label>{t("theme")}</label>
        <select
          name="theme"
          value={preferences.theme}
          onChange={handlePreferenceChange}
        >
          <option value="light">{t("light")}</option>
          <option value="dark">{t("dark")}</option>
        </select>
      </div>

      {/* Measurement Units */}
      <div className="form-group">
        <label>{t("measurement_units")}</label>
        <select
          name="measurement_unit"
          value={preferences.measurement_unit}
          onChange={handlePreferenceChange}
        >
          <option value="metric">
            {t("metric")}
          </option>

          <option value="imperial">
            {t("imperial")}
          </option>
        </select>
      </div>

      {/* Language */}
      <div className="form-group">
        <label>{t("language")}</label>
        <select
          name="language"
          value={preferences.language}
          onChange={handlePreferenceChange}
        >
          <option value="english">
            {t("english")}
          </option>

          <option value="hindi">
            {t("hindi")}
          </option>

          <option value="bengali">
            {t("bengali")}
          </option>
        </select>
      </div>

      {/* Timezone */}
      <div className="form-group">
        <label>{t("timezone")}</label>
        <select
          name="timezone"
          value={preferences.timezone}
          onChange={handlePreferenceChange}
        >
          <option value="Asia/Kolkata">
            Asia/Kolkata
          </option>

          <option value="America/New_York">
            America/New_York
          </option>

          <option value="Europe/London">
            Europe/London
          </option>
        </select>
      </div>

      {/* Currency */}
      <div className="form-group">
        <label>{t("currency")}</label>
        <select
          name="currency"
          value={preferences.currency}
          onChange={handlePreferenceChange}
        >
          <option value="INR">
            ₹ Indian Rupee (INR)
          </option>

          <option value="USD">
            $ US Dollar
          </option>

          <option value="EUR">
            € Euro
          </option>
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

    <h2 className="section-title">
      {t("data_export")}
    </h2>

    <p className="section-subtext">
      {t("data_export_desc")}
    </p>

    <div className="export-grid">

      <div className="export-box">
        <h3>{t("complete_data_export")}</h3>
        <p>{t("complete_data_export_desc")}</p>
        <button className="primary-btn">
          {t("export_all_data")}
        </button>
      </div>

      <div className="export-box">
        <h3>{t("selective_export")}</h3>
        <p>{t("selective_export_desc")}</p>
        <button className="secondary-btn">
          {t("choose_data")}
        </button>
      </div>

    </div>

    <h2
      className="section-title"
      style={{ marginTop: "2rem" }}
    >
      {t("data_storage")}
    </h2>

    <p className="section-subtext">
      {t("data_storage_desc")}
    </p>

    <div className="stats-grid">

      <div className="stat-card">
        <h1>2.4 GB</h1>
        <p>{t("total_data")}</p>
      </div>

      <div className="stat-card">
        <h1>4 Years</h1>
        <p>{t("data_retention")}</p>
      </div>

      <div className="stat-card">
        <h1>24 Hrs</h1>
        <p>{t("backup_frequency")}</p>
      </div>

    </div>

  </div>
)}
        {/* ==========================
            ACCOUNT
        =========================== */}
      {activeTab === "account" && (
  <div className="settings-card fadeIn">
    <h2 className="section-title">
      {t("account_management")}
    </h2>

    <p className="section-subtext">
      {t("account_management_desc")}
    </p>

    {/* <form className="account-form">
      <div className="form-group">
        <label>{t("current_password")}</label>
        <input
          type="password"
          placeholder={t("enter_current_password")}
        />
      </div>

      <div className="form-group">
        <label>{t("new_password")}</label>
        <input
          type="password"
          placeholder={t("enter_new_password")}
        />
      </div>

      <div className="form-group">
        <label>{t("confirm_new_password")}</label>
        <input
          type="password"
          placeholder={t("confirm_password")}
        />
      </div>

      <button className="primary-btn">
        {t("update_password")}
      </button>
    </form> */}
    <form
  className="account-form"
  onSubmit={handleUpdatePassword}
>

  <div className="form-group">
    <label>{t("current_password")}</label>

    <input
      type="password"
      name="current_password"
      value={passwordData.current_password}
      onChange={handlePasswordChange}
      placeholder={t("enter_current_password")}
      required
    />
  </div>

  <div className="form-group">
    <label>{t("new_password")}</label>

    <input
      type="password"
      name="new_password"
      value={passwordData.new_password}
      onChange={handlePasswordChange}
      placeholder={t("enter_new_password")}
      required
    />
  </div>

  <div className="form-group">
    <label>{t("confirm_new_password")}</label>

    <input
      type="password"
      name="confirm_password"
      value={passwordData.confirm_password}
      onChange={handlePasswordChange}
      placeholder={t("confirm_password")}
      required
    />
  </div>

  <button
    type="submit"
    className="primary-btn"
  >
    {t("update_password")}
  </button>

</form>

    <div className="danger-zone">
      <h2>{t("danger_zone")}</h2>

      <p>{t("delete_account_warning")}</p>

      <button className="danger-btn">
        {t("delete_account")}
      </button>
    </div>
  </div>
)}

      </div>
    </>
  );
}
