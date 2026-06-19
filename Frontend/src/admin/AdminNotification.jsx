import React from "react";
import AdminSidebar from "../components/AdminSidebar";
import "../scss/adminNotification.scss";

import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
} from "recharts";


import {
  FiSearch,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";

const notificationData = [
  { name: "Weather Alerts", value: 42 },
  { name: "Market Updates", value: 27 },
  { name: "Crop Recommendations", value: 24 },
  { name: "System Messages", value: 7 },
];

const deliveryData = [
  {
    batch: "Weather",
    delivered: 1200,
    failed: 50,
  },
  {
    batch: "Market",
    delivered: 850,
    failed: 25,
  },
  {
    batch: "Crop",
    delivered: 700,
    failed: 15,
  },
  {
    batch: "System",
    delivered: 600,
    failed: 12,
  },
  {
    batch: "General",
    delivered: 280,
    failed: 103,
  },
];

const COLORS = [
  "#2563eb",
  "#10b981",
  "#f59e0b",
  "#64748b",
];




const notificationHistory = [
  {
    id: 1,
    type: "Weather Alert",
    recipient: "All Users",
    sent: 1240,
    delivered: 1198,
    failed: 42,
    rate: "97%",
    timestamp: "2026-06-14 08:30",
    status: "completed",
  },
  {
    id: 2,
    type: "Market Update",
    recipient: "Active Users",
    sent: 890,
    delivered: 872,
    failed: 18,
    rate: "98%",
    timestamp: "2026-06-13 14:00",
    status: "completed",
  },
  {
    id: 3,
    type: "Crop Recommendation",
    recipient: "Nueva Ecija",
    sent: 145,
    delivered: 140,
    failed: 5,
    rate: "97%",
    timestamp: "2026-06-13 09:15",
    status: "completed",
  },
  {
    id: 4,
    type: "System Maintenance",
    recipient: "All Users",
    sent: 1240,
    delivered: 1105,
    failed: 135,
    rate: "89%",
    timestamp: "2026-06-12 18:00",
    status: "completed",
  },
  {
    id: 5,
    type: "Weather Alert",
    recipient: "Davao Region",
    sent: 320,
    delivered: 315,
    failed: 5,
    rate: "98%",
    timestamp: "2026-06-12 06:45",
    status: "completed",
  },
  {
    id: 6,
    type: "Planting Season Alert",
    recipient: "All Farmers",
    sent: 1240,
    delivered: 0,
    failed: 0,
    rate: "0%",
    timestamp: "2026-06-14 10:00",
    status: "sending",
  },
];





const renderLegend = (props) => {
  const { payload } = props;

  return (
    <ul className="custom-legend">
      {payload.map((entry, index) => (
        <li
          key={index}
          style={{
            color: COLORS[index],
          }}
        >
          <span
            className="legend-dot"
            style={{
              backgroundColor: COLORS[index],
            }}
          />
          {entry.value}
        </li>
      ))}
    </ul>
  );
};


const renderBarLegend = ({ payload }) => (
  <ul className="bar-legend">
    {payload.map((entry, index) => (
      <li
        key={index}
        style={{
          color: entry.color,
        }}
      >
        <span
          className="legend-dot"
          style={{
            backgroundColor: entry.color,
          }}
        />
        {entry.value}
      </li>
    ))}
  </ul>
);



const AdminNotification = () => {
  const totalSent = 5075;
  const delivered = 3630;
  const failed = 205;
  const deliveryRate = Math.round(
    (delivered / totalSent) * 100
  );

  return (
    <div className="admin-notification-page">
      <AdminSidebar />

      <main className="notification-content">
        <div className="page-header">
          <h1>Notification Monitoring</h1>
          <p>
            Track delivery statistics and notification
            performance.
          </p>
        </div>

        {/* Statistics */}

        <div className="stats-grid">
          <div className="stat-card">
            <span>TOTAL SENT</span>
            <h2>{totalSent.toLocaleString()}</h2>
          </div>

          <div className="stat-card">
            <span>DELIVERED</span>
            <h2 className="success">
              {delivered.toLocaleString()}
            </h2>
          </div>

          <div className="stat-card">
            <span>FAILED</span>
            <h2 className="danger">
              {failed.toLocaleString()}
            </h2>
          </div>

          <div className="stat-card">
            <span>DELIVERY RATE</span>
            <h2 className="primary">
              {deliveryRate}%
            </h2>
          </div>
        </div>

        {/* Charts */}

        <div className="charts-grid">

          {/* Pie Chart */}

          <div className="chart-card">
            <div className="card-header">
              <h3>Notifications by Type</h3>
            </div>

            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <PieChart>
                <Pie
                  data={notificationData}
                  cx="50%"
                  cy="45%"
                  innerRadius={75}
                  outerRadius={115}
                  dataKey="value"
                  paddingAngle={2}
                  strokeWidth={0}
                >
                  {notificationData.map(
                    (entry, index) => (
                      <Cell
                        key={index}
                        fill={COLORS[index]}
                      />
                    )
                  )}
                </Pie>

                <Tooltip />

                

                <Legend
                content={renderLegend}
                  verticalAlign="bottom"
                  iconType="circle"
                  wrapperStyle={{
                    paddingTop: "15px",
                    fontSize: "14px",
                    fontWeight: 500,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}

          <div className="chart-card">
            <div className="card-header">
              <h3>
                Delivery Performance by Batch
              </h3>
            </div>

            <ResponsiveContainer
              width="100%"
              height={350}
            >
              <BarChart
                data={deliveryData}
                margin={{
                  top: 10,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                />


                <XAxis
                  dataKey="batch"
                  tick={({ x, y, payload }) => (
                    <text
                      x={x}
                      y={y}
                      dy={16}
                      textAnchor="middle"
                      fill="#111827"
                      fontSize="14"
                      fontWeight="600"
                    >
                      {payload.value}
                    </text>
                  )}
                />

                <YAxis
                  tick={({ x, y, payload }) => (
                    <text
                      x={x}
                      y={y}
                      dx={-10}
                      textAnchor="end"
                      fill="#111827"
                      fontSize="13"
                      fontWeight="600"
                    >
                      {payload.value}
                    </text>
                  )}
                />

                <Tooltip />

                <Legend 
                content={renderBarLegend} 
                />

                <Bar
                  dataKey="delivered"
                  fill="#10b981"
                  radius={[6, 6, 0, 0]}
                />

                <Bar
                  dataKey="failed"
                  fill="#ef4444"
                  radius={[6, 6, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>


        {/* notifivation history */}
        <div className="history-cardd">
          <div className="history-header">
            <h3>Notification History</h3>

            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search notifications..."
              />
            </div>
          </div>

          <div className="history-table-wrapper">
            <table className="history-table">
              <thead>
                <tr>
                  <th>TYPE</th>
                  <th>RECIPIENT</th>
                  <th>SENT</th>
                  <th>DELIVERED</th>
                  <th>FAILED</th>
                  <th>RATE</th>
                  <th>TIMESTAMP</th>
                  <th>STATUS</th>
                </tr>
              </thead>

              <tbody>
                {notificationHistory.map((item) => (
                  <tr key={item.id}>
                    <td className="type">
                      {item.type}
                    </td>

                    <td>{item.recipient}</td>

                    <td>
                      {item.sent.toLocaleString()}
                    </td>

                    <td className="delivered">
                      {item.delivered.toLocaleString()}
                    </td>

                    <td className="failed">
                      {item.failed.toLocaleString()}
                    </td>

                    <td>{item.rate}</td>

                    <td className="timestamp">
                      {item.timestamp}
                    </td>

                    <td>
                      <span
                        className={`status-badge ${item.status}`}
                      >
                        {item.status === "completed" ? (
                          <>
                            <FiCheckCircle />
                            Completed
                          </>
                        ) : (
                          <>
                            <FiClock />
                            Sending...
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
};

export default AdminNotification;