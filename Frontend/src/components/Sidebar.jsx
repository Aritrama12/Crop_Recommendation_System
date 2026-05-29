// import { NavLink } from "react-router-dom";
// import "../scss/sidebar.scss";
// import {
  
//   Home,
//   Lightbulb,
//   CloudSun,
//   FlaskConical,
//   BarChart2,
//   User,
//   Settings,
//   LogOut,
// } from "lucide-react"; 
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// export default function Sidebar() {


//   const navigate = useNavigate();

//   const handleLogout = async () => {
//   try {
//     await axios.post(
//       'http://127.0.0.1:8000/api/auth/logout',
//       {
//         refresh: localStorage.getItem("refresh"),
//       },
//       {
//         headers: {
//           Authorization: `Bearer ${localStorage.getItem("access")}`,
//         },
//       }
//     );
//   } catch (error) {
//     console.error("Logout failed:", error);
//   } finally {
//     // Always clear local state
//     localStorage.removeItem("access");
//     localStorage.removeItem("refresh");

//     navigate("/",{ replace: true });
//   }
// };





//   return (
//     <aside className="sidebar">
//       {/* Logo Section */}
//       <div className="top-section">
//         <h2 className="logo">🌱 CropWise</h2>
//         <p className="subtitle">Smart Agriculture</p>
//       </div>

//       {/* User Info */}
//       <div className="user">
//         <div className="avatar">A</div>
//         <div className="userinfo">
//           <p className="name">a</p>
//           <p className="email">a@gmail.com</p>
//         </div>
//       </div>

//       {/* Navigation */}
//       <nav className="nav-links">
//         <NavLink to="/dashboard" end>
//           <Home size={18} />
//           Dashboard
//         </NavLink>
//         <NavLink to="/recommendations">
//           <Lightbulb size={18} />
//           Recommendations
//         </NavLink>
//         <NavLink to="/weather">
//           <CloudSun size={18} />
//           Weather
//         </NavLink>
//         <NavLink to="/soil-analysis">
//           <FlaskConical size={18} />
//           Soil Analysis
//         </NavLink>
//         {/* <NavLink to="/analytics">
//           <BarChart2 size={18} />
//           Analytics
//         </NavLink> */} 
//       </nav>

//       {/* Bottom Section */}
//       <nav className="bottom-links">
//         <NavLink to="/profile">
//           <User size={18} />
//           Profile
//         </NavLink>
//         <NavLink to="/settings">
//           <Settings size={18} />
//           Settings
//         </NavLink>
//          <div className="logout" onClick={handleLogout}>
//           <LogOut size={18} />
//            Logout
//         </div>
//       </nav>
//     </aside>
//   );
// }

import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import "../scss/sidebar.scss";
import {
  Home,
  Lightbulb,
  CloudSun,
  FlaskConical,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart2
} from "lucide-react";
import axios from "axios";

export default function Sidebar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/auth/logout",
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
      navigate("/", { replace: true });
    }
  };

  return (
    <>
      {/* mobile menu button */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* overlay */}
      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="top-section">
          <h2 className="logo">🌱 CropWise</h2>
          <p className="subtitle">Smart Agriculture</p>
        </div>

        <div className="user">
          <div className="avatar">A</div>
          <div className="userinfo">
            <p className="name">Aritra</p>
            <p className="email">a@gmail.com</p>
          </div>
        </div>

        <nav className="nav-links">
          <NavLink to="/dashboard" onClick={() => setMenuOpen(false)}>
            <Home size={18} />
            Dashboard
          </NavLink>

          <NavLink to="/recommendations" onClick={() => setMenuOpen(false)}>
            <Lightbulb size={18} />
            Recommendations
          </NavLink>

          <NavLink to="/farm-records" onClick={() => setMenuOpen(false)}>
            <BarChart2 size={18} />
            Farm Records
          </NavLink>

          

          <NavLink to="/weather" onClick={() => setMenuOpen(false)}>
            <CloudSun size={18} />
            Weather
          </NavLink>

          <NavLink to="/soil-analysis" onClick={() => setMenuOpen(false)}>
            <FlaskConical size={18} />
            Soil Analysis
          </NavLink>
        </nav>

        <nav className="bottom-links">
          <NavLink to="/profile" onClick={() => setMenuOpen(false)}>
            <User size={18} />
            Profile
          </NavLink>

          <NavLink to="/settings" onClick={() => setMenuOpen(false)}>
            <Settings size={18} />
            Settings
          </NavLink>

          <div className="logout" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </div>
        </nav>
      </aside>
    </>
  );
}