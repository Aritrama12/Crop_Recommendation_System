import "../scss/adminSidebar.scss";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Bell,
  MessageSquare,
  Monitor,
  Shield,
  LogOut,
} from "lucide-react";

const AdminSidebar = () => {
  return (
    <aside className="adminSidebar">
      {/* Header */}
      <div className="sidebarHeader">
        <div className="logoBox">
          <Shield size={22} />
        </div>

        <div className="headerText">
          <h3>Admin Panel</h3>
          <p>CropWise System</p>
        </div>
      </div>

      {/* Menu */}
      <div className="sidebarMenu">

        <NavLink
          to="/admin-dashboard"
          className={({ isActive }) =>
            isActive ? "menuItem active" : "menuItem"
          }
        >
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/admin-users"
          className={({ isActive }) =>
            isActive ? "menuItem active" : "menuItem"
          }
        >
          <Users size={20} />
          <span>Users</span>
        </NavLink>

        <NavLink
          to="/admin-analytics"
          className={({ isActive }) =>
            isActive ? "menuItem active" : "menuItem"
          }
        >
          <BarChart3 size={20} />
          <span>Analytics</span>
        </NavLink>

        <NavLink
          to="/admin-notifications"
          className={({ isActive }) =>
            isActive ? "menuItem active" : "menuItem"
          }
        >
          <Bell size={20} />
          <span>Notifications</span>
        </NavLink>

        <NavLink
          to="/admin-feedback"
          className={({ isActive }) =>
            isActive ? "menuItem active" : "menuItem"
          }
        >
          <MessageSquare size={20} />
          <span>Feedback</span>
          <div className="badge">4</div>
        </NavLink>

        <NavLink
          to="/admin-system-status"
          className={({ isActive }) =>
            isActive ? "menuItem active" : "menuItem"
          }
        >
          <Monitor size={20} />
          <span>System Status</span>
          <div className="badge">2</div>
        </NavLink>

      </div>

      {/* Bottom Logout */}
      <div className="logoutSection">
        <NavLink to="/login" className="menuItem adminlogout">
          <LogOut size={20} />
          <span>Logout</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default AdminSidebar;