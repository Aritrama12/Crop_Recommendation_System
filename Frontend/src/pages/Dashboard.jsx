import React from "react";
import { Link } from "react-router-dom";
import "../scss/dashboard.scss";
import Sidebar from "../components/Sidebar";
const Dashboard = () => {
  return (
     <>
      <Sidebar />
      <div className="dashboard-container">
      <div className="dashboard">
      {/* Header Section */}
      <header className="dashboard-header">
        <h1>Your Farm <span>Dashboard</span></h1>
        <p>
          Monitor your farm’s performance, get AI-powered recommendations, and
          track your progress with comprehensive analytics and insights.
        </p>
        <div className="header-buttons">
          <Link to="/recommendations">
          <button className="primary-btn">Get Smart Recommendations</button>
          </Link>
          
          <button className="secondary-btn">View Farm Analytics</button>
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
        <h2>Your Farm Overview</h2>
        <div className="overview-grid">
          <div className="overview-card">
            <h3>10,000+</h3>
            <p>Farmers Helped</p>
          </div>
          <div className="overview-card">
            <h3>35%</h3>
            <p>Total Improvement</p>
          </div>
          <div className="overview-card">
            <h3>94%</h3>
            <p>Success Rate</p>
          </div>
          <div className="overview-card">
            <h3>50+</h3>
            <p>Crops Supported</p>
          </div>
        </div>
      </section>

      {/* Recent Activity Section */}
      <section className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-grid">
          <div className="activity-card">
            <h4>Latest Recommendations</h4>
            <ul>
              <li><b>Wheat</b> – Winter Season</li>
              <li><b>Maize</b> – Monsoon Season</li>
              <li><b>Soybean</b> – Post-Monsoon</li>
            </ul>
            <button className="link-btn">View All Recommendations</button>
          </div>
          <div className="activity-card">
            <h4>Performance Highlights</h4>
            <p>This Season’s Yield: <b>+15%</b></p>
            <p>Cost Reduction: <b>₹5,000</b></p>
            <p>Success Rate: <b>94%</b></p>
            <button className="link-btn">View Detailed Analysis</button>
          </div>
        </div>
      </section>

      {/* Smart Farming Tools */}
      <section className="smart-farming">
        <h2>Everything You Need for Smart Farming</h2>
        <p className="section-desc">
          Our comprehensive platform provides all the tools and insights you need
          to make informed farming decisions.
        </p>
        <div className="tools-grid">
          <div className="tool-card">
            <div className="icon green">🌾</div>
            <h4>Smart Crop Recommendations</h4>
            <p>Get AI-powered crop suggestions based on soil, weather, and market conditions.</p>
            <button className="learn-btn">Learn More</button>
          </div>

          <div className="tool-card">
            <div className="icon blue">☁️</div>
            <h4>Weather Insights</h4>
            <p>Real-time weather data and forecasts to optimize your farming decisions.</p>
            <button className="learn-btn">Learn More</button>
          </div>
          
          <div className="tool-card">
            <div className="icon orange">🧪</div>
            <h4>Soil Analysis</h4>
            <p>Comprehensive soil testing and nutrient analysis for better yields.</p>
            <button className="learn-btn">Learn More</button>
          </div>

          <div className="tool-card">
            <div className="icon purple">📊</div>
            <h4>Analytics Dashboard</h4>
            <p>Track your farming performance and optimize your strategies.</p>
            <button className="learn-btn">Learn More</button>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="quick-actions">
        <h2>Quick Actions</h2>
        <p>Access your most used tools and features quickly from your dashboard.</p>
        <div className="action-buttons">
          <button className="primary-btn">Smart Crop Analysis</button>
          <button className="secondary-btn">Check Weather</button>
          <button className="tertiary-btn">Soil Testing</button>
        </div>
      </section>
    </div>
    </div>

    </>

  );
};

export default Dashboard;
