import React from "react";
import { Link } from "react-router-dom";
import "../scss/dashboard.scss";
import Sidebar from "../components/Sidebar";
import { useTranslation } from "react-i18next";
import  { useEffect, useState } from "react";

const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [recentRecommendations, setRecentRecommendations] = useState([]);
    const { t } = useTranslation();
    


    useEffect(() => {
  fetchRecentRecommendations();
  fetchAnalytics();
}, []);

const fetchAnalytics = async () => {
  try {
    const res = await fetch("https://cropwise-backend1.onrender.com/api/analytics/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;

    const data = await res.json();

    setAnalytics(data);
  } catch (err) {
    console.error(err);
  }
};

    const token =
  localStorage.getItem("access") ||
  localStorage.getItem("token");

useEffect(() => {
  fetchRecentRecommendations();
}, []);

const fetchRecentRecommendations = async () => {
  try {
    const res = await fetch("https://cropwise-backend1.onrender.com/api/history/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) return;

    const data = await res.json();

    // Latest 3 predictions
    setRecentRecommendations(data.slice(0, 3));

  } catch (err) {
    console.log("Failed to fetch history", err);
  }
};
  return (
     <>
      <Sidebar />
      <div className="dashboard-container">
      <div className="dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
       <h1>
  {t("your_farm")} <span>{t("dashboard")}</span>
</h1>
        <p>{t("dashboard_description")}</p>
        <div className="header-buttons">
          <Link to="/recommendations">
          <button className="primary-btn">
             {t("get_smart_recommendations")}
          </button>
          </Link>
          <Link to="/farm-records">
           <button className="secondary-btn">
           {t("view_farm_analytics")}
          </button>
          </Link>
         
        </div>
      </header>

      {/* Banner Image */}
      <div className="dashboard-banner">
        <img
          src="https://t3.ftcdn.net/jpg/15/42/35/04/360_F_1542350461_sB9xctFhIhImu2KhOg6t7Yq5N0szPhql.jpg"
          alt="Farm"
        />
      </div>

      {/* Farm Overview Section */}
      <section className="farm-overview">
         <h2>{t("your_farm_overview")}</h2>
        <div className="overview-grid">
          {/* <div className="overview-card">
            <h3>10,000+</h3>
              <p>{t("farmers_helped")}</p>
          </div> */}
          {/* <div className="overview-card">
            <h3>35%</h3>
            <p>{t("total_improvement")}</p>
          </div> */}
          <div className="overview-card">
            <h3>94%</h3>
             <p>{t("success_rate")}</p>
          </div>
          <div className="overview-card">
            <h3>20+</h3>
             <p>{t("crops_supported")}</p>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="recent-activity">
        <h2>{t("recent_activity")}</h2>
        <div className="activity-grid">
          <div className="activity-card">
            <h4>{t("latest_recommendations")}</h4>
            {/* <ul>
                      <li>
  <b>{t("wheat")}</b> – {t("winter_season")}
</li>

<li>
  <b>{t("maize")}</b> – {t("monsoon_season")}
</li>

<li>
  <b>{t("soybean")}</b> – {t("post_monsoon")}
</li>
            </ul> */}
<ul>
  {recentRecommendations.length > 0 ? (
    recentRecommendations.map((item) => (
      <li key={item.id || item.created_at}>
        <b>{t(`crop.${item.crop.toLowerCase()}`)}</b>

        <small
          style={{
            display: "block",
            color: "#888",
            marginTop: "4px",
          }}
        >
          {new Date(item.created_at).toLocaleDateString("en-IN")}
        </small>
      </li>
    ))
  ) : (
    <li>{t("no_history")}</li>
  )}
</ul>
             {/* <button className="link-btn">
  {t("view_all_recommendations")}
</button> */}
<Link to="/recommendations?tab=history">
  <button className="link-btn">
    {t("view_all_recommendations")}
  </button>
</Link>
          </div>
          <div className="activity-card">
            {/* <h4>{t("performance_highlights")}</h4>

<p>
  {t("this_season_yield")} <b>+15%</b>
</p>

<p>
  {t("cost_reduction")} <b>₹5,000</b>
</p>

<p>
  {t("success_rate")} <b>94%</b>
</p>
<Link to="/analytics">
<button className="link-btn">
  {t("view_detailed_analysis")}
</button>
</Link> */}


<h4>{t("performance_highlights")}</h4>

<p>
  {t("average_yield")}{" "}
  <b>
    {analytics
      ? analytics.average_yield.toFixed(2)
      : "--"}{" "}
    ton/ha
  </b>
</p>

<p>
  {t("total_profit")}{" "}
  <b>
    ₹
    {analytics
      ? analytics.total_profit.toLocaleString()
      : "--"}
  </b>
</p>

<p>
  {t("quality_rate")}{" "}
  <b>
    {analytics
      ? analytics.quality_rate.toFixed(1)
      : "--"}
    %
  </b>
</p>

<Link to="/analytics">
  <button className="link-btn">
    {t("view_detailed_analysis")}
  </button>
</Link>

          </div>
        </div>
      </section>

      {/* Smart Farming Tools */}
      <section className="smart-farming">
          <h2>{t("everything_you_need")}</h2>
           
           <p className="section-desc">
  {t("everything_you_need_desc")}
</p>
        <div className="tools-grid">
          <div className="tool-card">
            <div className="icon green">🌾</div>
              
              <h4>{t("smart_crop_recommendations")}</h4>

<p>{t("smart_crop_recommendations_desc")}</p>
<Link to="/recommendations">
<button className="learn-btn">
  {t("learn_more")}
</button>
</Link>

          </div>

          <div className="tool-card">
            <div className="icon blue">☁️</div>
               
               <h4>{t("weather_insights")}</h4>

<p>{t("weather_insights_desc")}</p>

<Link to="/weather">
   <button className="learn-btn">
  {t("learn_more")}
  </button>
</Link>

          </div>
          
          <div className="tool-card">
            <div className="icon orange">🧪</div>
            <h4>{t("soil_analysis")}</h4>

<p>{t("soil_analysis_desc")}</p>

<Link to="/soil-analysis">
<button className="learn-btn">
  {t("learn_more")}
</button>
</Link>

          </div>

          <div className="tool-card">
            <div className="icon purple">📊</div>
               <h4>{t("analytics_dashboard")}</h4>

<p>{t("analytics_dashboard_desc")}</p>

<Link to="/analytics">
<button className="learn-btn">
  {t("learn_more")}
</button>
</Link>

          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
            <h2>{t("quick_actions")}</h2>

<p>{t("quick_actions_desc")}</p>
        
        <div className="action-buttons">
          <Link to='/recommendations'>
              <button className="primary-btn">
  {t("smart_crop_analysis")}
</button>
          </Link>
          <Link to='/weather'>
             <button className="secondary-btn">
  {t("check_weather")}
</button>
          </Link>
          <Link to='/soil-analysis'>
             <button className="tertiary-btn">
  {t("soil_testing")}
</button>
          </Link>
         
        </div>
      </section>
    </div>
    </div>

    </>

  );
};

export default Dashboard;
