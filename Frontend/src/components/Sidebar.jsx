

// import { NavLink, useNavigate, useLocation } from "react-router-dom";
// import { useState, useEffect } from "react";
// import axios from "axios";

// import "../scss/sidebar.scss";

// import {
//   Home,
//   Lightbulb,
//   CloudSun,
//   FlaskConical,
//   User,
//   Settings,
//   LogOut,
//   Menu,
//   X,
//   BarChart2,
// } from "lucide-react";

// export default function Sidebar() {
//   const navigate = useNavigate();
//   const location = useLocation();

//   const [menuOpen, setMenuOpen] = useState(false);

//   // User State
//   // const [user, setUser] = useState(() => {
//   //   return JSON.parse(localStorage.getItem("user")) || {};
//   // });
//    // for getting 'user' data from local storage, so that we can display
//   // admin button in sidebar if user is admin
//   // const user = JSON.parse(localStorage.getItem("user"));
//     const user = JSON.parse(localStorage.getItem("user")) || {};

//   // Close sidebar when route changes
//   useEffect(() => {
//     setMenuOpen(false);
//   }, [location.pathname]);

//   // Prevent body scroll when sidebar is open
//   useEffect(() => {
//     document.body.style.overflow = menuOpen ? "hidden" : "auto";

//     return () => {
//       document.body.style.overflow = "auto";
//     };
//   }, [menuOpen]);

//   // Fetch latest user profile
//   useEffect(() => {
//     const fetchUserProfile = async () => {
//       try {
//         const access = localStorage.getItem("access");

//         if (!access) return;

//     const response = await axios.get(
//         "http://127.0.0.1:8000/api/profiles/profile",
//         {
//        headers: {
//        Authorization: `Bearer ${access}`,
//     },
//       }
//      );
//         setUser(response.data);

//         localStorage.setItem(
//           "user",
//           JSON.stringify(response.data)
//         );
//       } catch (error) {
//         console.log("Unable to fetch profile", error);
//       }
//     };

//     fetchUserProfile();
//   }, []);

//   // Logout
//   const handleLogout = async () => {
//     setMenuOpen(false);

//     try {
//       await axios.post(
//         "http://127.0.0.1:8000/api/auth/logout/",
//         {
//           refresh: localStorage.getItem("refresh"),
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("access")}`,
//           },
//         }
//       );
//     } catch (error) {
//       console.log(error);
//     } finally {
//       localStorage.removeItem("access");
//       localStorage.removeItem("refresh");
//       localStorage.removeItem("user");

//       navigate("/", {
//         replace: true,
//       });
//     }
//   };

//   return (
//     <>
//       {/* Mobile Menu Button */}

//       <button
//         className="menu-toggle"
//         onClick={() => setMenuOpen(!menuOpen)}
//       >
//         {menuOpen ? <X size={24} /> : <Menu size={24} />}
//       </button>

//       {/* Overlay */}

//       {menuOpen && (
//         <div
//           className="sidebar-overlay"
//           onClick={() => setMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}

//       <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
//         {/* Logo */}

//         <div className="top-section">
//           <h2 className="logo">🌱 CropWise</h2>

//           <p className="subtitle">Smart Agriculture</p>
//         </div>

//         {/* User Card */}

//         <div className="user">
//           <div className="avatar">
//             {user?.profile_image ? (
//               <img
//                 src={`http://127.0.0.1:8000${user.profile_image}`}
//                 alt="Profile"
//               />
//             ) : (
//               (user?.first_name?.charAt(0) ||
//                 user?.username?.charAt(0) ||
//                 "U").toUpperCase()
//             )}
//           </div>

//           <div className="userinfo">
//             <p className="name">
//               {user?.first_name || user?.last_name
//                 ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
//                 : user?.username || "Guest"}
//             </p>

//             <p className="email">
//               {user?.email || "No Email"}
//             </p>
//           </div>
//         </div>

//         {/* Navigation */}

//         <nav className="nav-links">
//           <NavLink to="/dashboard">
//             <Home size={20} />
//             <span>Dashboard</span>
//           </NavLink>

//           <NavLink to="/recommendations">
//             <Lightbulb size={20} />
//             <span>Recommendations</span>
//           </NavLink>

//           <NavLink to="/farm-records">
//             <BarChart2 size={20} />
//             <span>Farm Records</span>
//           </NavLink>

//           <NavLink to="/weather">
//             <CloudSun size={20} />
//             <span>Weather</span>
//           </NavLink>

//           <NavLink to="/soil-analysis">
//             <FlaskConical size={20} />
//             <span>Soil Analysis</span>
//           </NavLink>
//         </nav>

//             {/* <NavLink to="/markets">
//              <BarChart2 size={20} />
//              Markets
//            </NavLink> */}
         

//         {/* Bottom Links */}

//         <nav className="bottom-links">
//           {user?.is_staff && (
//             <NavLink to="/admin-dashboard">
//               <User size={20} />
//               <span>Admin Panel</span>
//             </NavLink>
//           )}

//           <NavLink to="/profile">
//             <User size={20} />
//             <span>Profile</span>
//           </NavLink>

//           <NavLink to="/settings">
//             <Settings size={20} />
//             <span>Settings</span>
//           </NavLink>

//           <div
//             className="logout"
//             onClick={handleLogout}
//           >
//             <LogOut size={20} />
//             <span>Logout</span>
//           </div>
//         </nav>
//       </aside>
//     </>
//   );
// }



import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../scss/sidebar.scss";

import {
  Home,
  TrendingUp,
  Lightbulb,
  CloudSun,
  FlaskConical,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart2,
} from "lucide-react";

export default function Sidebar() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  // User State
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || {};
  });

  // Close sidebar on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "auto";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [menuOpen]);

  // Fetch latest profile
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const access = localStorage.getItem("access");

        if (!access) return;

        const response = await axios.get(
          "https://cropwise-backend1.onrender.com/api/profiles/profile",
          {
            headers: {
              Authorization: `Bearer ${access}`,
            },
          }
        );

        console.log("Profile:", response.data);

        // Preserve fields like is_staff
        const oldUser =
          JSON.parse(localStorage.getItem("user")) || {};

        const updatedUser = {
          ...oldUser,
          ...response.data,
        };

        setUser(updatedUser);

        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );
      } catch (error) {
        console.error("Unable to fetch profile", error);
      }
    };

    fetchUserProfile();
  }, []);

  // Logout
  const handleLogout = async () => {
    setMenuOpen(false);

    try {
      await axios.post(
        "https://cropwise-backend1.onrender.com/api/auth/logout/",
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
      console.log(error);
    } finally {
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("user");

      navigate("/", {
        replace: true,
      });
    }
  };

  const profileImage = user?.profile_image
    ? user.profile_image.startsWith("http")
      ? user.profile_image
      : `https://cropwise-backend1.onrender.com${user.profile_image}`
    : null;

  return (
    <>
      {/* Mobile Button */}

      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay */}

      {menuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Sidebar */}

      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        {/* Logo */}

       
        <div className="top-section">
  <h2 className="logo">🌱 {t("cropwise")}</h2>
  <p className="subtitle">{t("smart_agriculture")}</p>
</div>
        {/* User */}

        <div className="user">
          <div className="avatar">
            {profileImage ? (
              <img
                src={profileImage}
                alt="Profile"
              />
            ) : (
              <span>
                {(
                  user?.first_name?.charAt(0) ||
                  user?.username?.charAt(0) ||
                  "U"
                ).toUpperCase()}
              </span>
            )}
          </div>

          <div className="userinfo">
            <p className="name">
  {`${user?.first_name || ""} ${user?.last_name || ""}`.trim() ||
    user?.username ||
    t("guest")}
</p>

<p className="email">
  {user?.email || t("no_email")}
</p>
          </div>
        </div>

        {/* Navigation */}

        <nav className="nav-links">
  <NavLink to="/dashboard">
    <Home size={20} />
    <span>{t("dashboard")}</span>
  </NavLink>

  <NavLink to="/recommendations">
    <Lightbulb size={20} />
    <span>{t("recommendations")}</span>
  </NavLink>

  <NavLink to="/farm-records">
    <BarChart2 size={20} />
    <span>{t("farm_records")}</span>
  </NavLink>

  <NavLink to="/weather">
    <CloudSun size={20} />
    <span>{t("weather")}</span>
  </NavLink>

  <NavLink to="/soil-analysis">
    <FlaskConical size={20} />
    <span>{t("soil_analysis")}</span>
  </NavLink>

   <NavLink to="/analytics">
    <TrendingUp size={20} />
    <span>{t("analytics")}</span>
  </NavLink>
</nav>
        {/* Bottom */}

      <nav className="bottom-links">
  {user?.is_staff && (
    <NavLink to="/admin-dashboard">
      <User size={20} />
      <span>{t("admin_panel")}</span>
    </NavLink>
  )}

  <NavLink to="/profile">
    <User size={20} />
    <span>{t("profile")}</span>
  </NavLink>

  <NavLink to="/settings">
    <Settings size={20} />
    <span>{t("settings")}</span>
  </NavLink>

  <div className="logout" onClick={handleLogout}>
    <LogOut size={20} />
    <span>{t("logout")}</span>
  </div>
</nav>
      </aside>
    </>
  );
}