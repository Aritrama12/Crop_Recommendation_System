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
import { settingsAPI } from "../api/settingsAPI";

import "../scss/NotificationPanel.scss";

const NotificationPanel = () => {
 const [isOpen, setIsOpen] = useState(false);

 const [notifications, setNotifications] = useState([]);
 const [unreadCount, setUnreadCount] = useState(0);

// Fetch notifications from API
const fetchNotifications = async () => {
  try {
    const notificationsRes =
      await settingsAPI.getNotifications();

    const unreadRes =
      await settingsAPI.getUnreadCount();

    const formattedNotifications =
      notificationsRes.data.map((n) => ({
        id: n.id,
        title: n.title,
        message: n.message,
        type: n.notification_type,
        read: n.is_read,
        timestamp: new Date(n.created_at),
      }));

    setNotifications(formattedNotifications);

    setUnreadCount(
      unreadRes.data.unread_count
    );

  } catch (error) {
    console.error(
      "Failed to load notifications",
      error
    );
  }
};  


// Refs for detecting outside clicks
  const panelRef = useRef(null);
  const buttonRef = useRef(null);

// Close panel when clicking outside
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



  // Fetch notifications on component mount
  useEffect(() => {
  fetchNotifications();
}, []); 



// WebSocket for real-time updates
useEffect(() => {

  const token = localStorage.getItem("access");

  if (!token) {
    console.log("No token found");
    return;
  }

  let socket = null;
  let reconnectTimeout = null;
  let isUnmounted = false;

  const connectWebSocket = () => {

    socket = new WebSocket(
      `ws://127.0.0.1:8000/ws/notifications/?token=${token}`
    );

    socket.onopen = () => {
      console.log("WS Connected");
    };

    socket.onmessage = (event) => {

      console.log("MESSAGE RECEIVED");

      const data = JSON.parse(event.data);

      const newNotification = {
        id: data.id,
        title: data.title,
        message: data.message,
        type: data.notification_type,
        read: false,
        timestamp: new Date(data.created_at),
      };

      setNotifications((prev) => {

        const exists = prev.some(
          (n) => n.id === newNotification.id
        );

        if (exists) {
          return prev;
        }

        return [
          newNotification,
          ...prev,
        ];
      });

      setUnreadCount((prev) => prev + 1);
    };

    socket.onerror = (error) => {
      console.error(
        "WebSocket Error:",
        error
      );
    };

    socket.onclose = () => {

      console.log("WS Closed");

      if (!isUnmounted) {

        console.log(
          "Reconnecting in 2 seconds..."
        );

        reconnectTimeout = setTimeout(
          () => {
            connectWebSocket();
          },
          2000
        );
      }
    };
  };

  connectWebSocket();

  return () => {

    isUnmounted = true;

    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }

    if (socket) {
      socket.close();
    }
  };

}, []);


// Mark a single notification as read
 const markAsRead = async (id) => {
  try {

    await settingsAPI.markNotificationRead(id);

    await fetchNotifications();

  } catch (error) {
    console.error(
      "Failed to mark notification read",
      error
    );
  }
};



// Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({
        ...n,
        read: true,
      }))
    );
  };



  // Clear a notification from the list
  const clearNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };




  // Get icon based on notification type
  const getIcon = (type) => {
  switch (type) {

    case "weather":
      return (
        <Cloud className="icon weather" />
      );

    case "market":
      return (
        <TrendingUp className="icon market" />
      );

    case "system":
      return (
        <Info className="icon info" />
      );

    default:
      return (
        <Bell className="icon" />
      );
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

                  <div className="notification-contentt">
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