import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  X,
  AlertTriangle,
  TrendingUp,
  Cloud,
  CheckCircle,
  Info,
} from "lucide-react";

import "../scss/NotificationPanel.scss";

const NotificationPanel = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [notifications, setNotifications] = useState([
    {
      id: "1",
      type: "alert",
      title: "Weather Alert",
      message:
        "Heavy rainfall expected in your region for next 48 hours. Consider delaying pesticide application.",
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: "2",
      type: "market",
      title: "Market Price Update",
      message:
        "Rice prices increased by 12% in your local market. Good time to sell stored produce.",
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: "3",
      type: "weather",
      title: "Optimal Planting Conditions",
      message:
        "Weather conditions are ideal for wheat planting this week. Soil moisture levels are optimal.",
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      read: false,
    },
    {
      id: "4",
      type: "success",
      title: "Farm Record Added",
      message:
        "Your cotton harvest record has been successfully saved to the system.",
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      read: true,
    },
    {
      id: "5",
      type: "info",
      title: "New Crop Recommendation",
      message:
        "Based on current soil analysis, maize is now highly recommended for your farm.",
      timestamp: new Date(Date.now() - 36 * 60 * 60 * 1000),
      read: true,
    },
  ]);

  const panelRef = useRef(null);
  const buttonRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isOpen &&
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target) &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const markAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
  };

  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const getIcon = (type) => {
    switch (type) {
      case "alert":
        return <AlertTriangle className="icon alert" />;
      case "market":
        return <TrendingUp className="icon market" />;
      case "weather":
        return <Cloud className="icon weather" />;
      case "success":
        return <CheckCircle className="icon success" />;
      case "info":
        return <Info className="icon info" />;
      default:
        return <Bell className="icon" />;
    }
  };

  const formatTimestamp = (date) => {
    const now = new Date();

    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;

    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  return (
    <div className="notification-container">
      <button
        ref={buttonRef}
        className="notification-btn"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell size={20} />

        {unreadCount > 0 && (
          <span className="notification-badge">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="notification-panel" ref={panelRef}>
          <div className="panel-header">
            <div>
              <h3>Notifications</h3>
              <p>
                {unreadCount > 0
                  ? `${unreadCount} unread`
                  : "All caught up!"}
              </p>
            </div>

            {unreadCount > 0 && (
              <button
                className="mark-read-btn"
                onClick={markAllAsRead}
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="notification-list">
            {notifications.length === 0 ? (
              <div className="empty-state">
                <Bell size={48} />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`notification-item ${
                    !notification.read ? "unread" : ""
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="notification-icon">
                    {getIcon(notification.type)}
                  </div>

                  <div className="notification-content">
                    <div className="notification-top">
                      <h4>{notification.title}</h4>

                      <button
                        className="delete-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id);
                        }}
                      >
                        <X size={14} />
                      </button>
                    </div>

                    <p>{notification.message}</p>

                    <div className="notification-footer">
                      <span>
                        {formatTimestamp(notification.timestamp)}
                      </span>

                      {!notification.read && (
                        <span className="new-badge">New</span>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;