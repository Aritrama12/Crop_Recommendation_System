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
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AdminSidebar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // setMenuOpen(false);

    try {
      await axios.post(
        "https://cropwise-backend1.onrender.com/api/auth/logout",
        {
          refresh: localStorage.getItem("refresh"),
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`,
          },
        }
      );
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      navigate("/", {
        replace: true,
      });
    }
  };




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

          <NavLink to="/dashboard" className="menuItem">
            <LayoutDashboard size={20} />
            Farmer View
          </NavLink>

       

 
          <div 
            className="menuItem adminlogout"
            onClick={handleLogout}
          >
            <LogOut size={20} />
            <span>Logout</span>
          </div>


      </div>
    </aside>
  );
};

export default AdminSidebar;