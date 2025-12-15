// import React, { use, useState } from "react";
// import Sidebar from "../components/Sidebar";
// import "../scss/profile.scss";

// export default function Profile() {
//   const [isEditing, setIsEditing] = useState(false);
//   const [profileData, setProfileData] = useState({
//     full_name: "Rimi Halder",
//     specialization: "Organic Farming",
//     location: "Kolkata, West Bengal, India",
//     email: "rimi.ex@email.com",
//     phone_number: "+91 98765 43210",
//     farm_name: "Green Valley Farm",
//     bio: "Passionate organic farmer with 1 year of experience in sustainable agriculture. Specialized in crop rotation and natural pest management.",
//     member_since: "March 2020",
//     experience: "1 year",
//     farm_size: "25 hectares",
//     achievements: "4 Awards",
//     profile_image: null,
//   });


//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setProfileData({ ...profileData, [name]: value });
//   };

//   const toggleEdit = () => {
//     if (isEditing) {
//       alert("Profile saved successfully (dummy alert)");
//     }
//     setIsEditing(!isEditing);
//   };

//   return (
//     <>
//       <Sidebar />
//       <div className="profile-page">
//         <div className="top-header">
//           <h1>My Profile</h1>
//           <p>Manage your personal information and farming details</p>
//         </div>

//         <div className="profile-card">
//           <div className="profile-header">
//             <div className="profile-avatar">RH</div>
//             <div className="profile-info">
//               <h2>{profileData.full_name}</h2>
//               <p className="specialization">{profileData.specialization}</p>
//             </div>
//             <div className="profile-actions">
//               <button className="btn">📸 Change Photo</button>
//               <button className="btn edit" onClick={toggleEdit}>
//                 {isEditing ? "💾 Save" : "✏️ Edit"}
//               </button>
//             </div>
//           </div>

//           <div className="profile-content">
//             <div className="profile-left">
//               <div className="field">
//                 <strong>Full Name</strong>
//                 <input
//                   type="text"
//                   name="fullName"
//                   value={profileData.full_name}
//                   disabled={!isEditing}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="field">
//                 <strong>Email Address</strong>
//                 <input
//                   type="email"
//                   name="email"
//                   value={profileData.email}
//                   disabled={!isEditing}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="field">
//                 <strong>Phone Number</strong>
//                 <input
//                   type="text"
//                   name="phone"
//                   value={profileData.phone_number}
//                   disabled={!isEditing}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="field bio-field">
//                 <strong>Bio</strong>
//                 <textarea
//                   name="bio"
//                   value={profileData.bio}
//                   disabled={!isEditing}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>

//             <div className="profile-right">
//               <div className="field">
//                 <strong>Location</strong>
//                 <input
//                   type="text"
//                   name="location"
//                   value={profileData.location}
//                   disabled={!isEditing}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="field">
//                 <strong>Farm Name</strong>
//                 <input
//                   type="text"
//                   name="farmName"
//                   value={profileData.farm_name}
//                   disabled={!isEditing}
//                   onChange={handleChange}
//                 />
//               </div>

//               <div className="field">
//                 <strong>Specialization</strong>
//                 <input
//                   type="text"
//                   name="specialization"
//                   value={profileData.specialization}
//                   disabled={!isEditing}
//                   onChange={handleChange}
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="profile-stats">
//             <div className="stat-item">
//               <span>📅 Member Since</span>
//               <p>{profileData.member_since}</p>
//             </div>
//             <div className="stat-item">
//               <span>🌾 Experience</span>
//               <p>{profileData.experience}</p>
//             </div>
//             <div className="stat-item">
//               <span>📍 Farm Size</span>
//               <p>{profileData.farm_size}</p>
//             </div>
//             <div className="stat-item">
//               <span>🏆 Achievements</span>
//               <p>{profileData.achievements}</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// }





import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import "../scss/profile.scss";
import axios from "axios";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagePreview, setImagePreview] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
const [popupMessage, setPopupMessage] = useState("");


  // Helper to get correct image URL
  const getProfileImageUrl = (image) => {
    if (!image) return null;
    if (image instanceof File) return imagePreview;
    return `http://127.0.0.1:8000${image}`;
  };

  // Fetch profile data
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("access");
      const res = await axios.get(
        "http://127.0.0.1:8000/api/profiles/profile",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setProfileData(res.data);
    } catch (err) {
      console.error("Failed to fetch profile", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // Save profile data
  const saveProfile = async () => {
    try {
      const token = localStorage.getItem("access");
      const formData = new FormData();

      Object.entries(profileData).forEach(([key, value]) => {
        if (value !== null && value !== "") {
          // Only send image if it's a File object
          if (key === "profile_image" && !(value instanceof File)) return;
          formData.append(key, value);
        }
      });

      const res = await axios.patch(
        "http://127.0.0.1:8000/api/profiles/profile",
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProfileData(res.data);
      setIsEditing(false);
      // Show popup
      setPopupMessage("Profile updated successfully! 🎉🤩");
      setShowPopup(true);      
      setImagePreview(null);

      // Hide after 2.5 seconds
      setTimeout(() => setShowPopup(false), 2500);
    } catch (error) {
      console.error("Failed to update profile", error);
      setPopupMessage("Failed to save profile");
      setShowPopup(true);
      setTimeout(() => setShowPopup(false), 2500);    
    }
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  // Handle image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(URL.createObjectURL(file));
      setProfileData({ ...profileData, profile_image: file });
    }
  };

  const toggleEdit = () => {
    if (isEditing) {
      saveProfile(); // PATCH happens here
    } else {
      setIsEditing(true);
    }
  };

  if (loading)
    return (
      <p
        style={{
          color: "red",
          display: "flex",
          justifyContent: "center",
          fontSize: "3rem",
          fontWeight: "700",
          marginTop: "5rem",
        }}
      >
        Loading profile...
      </p>
    );

  if (!profileData)
    return (
      <p
        style={{
          color: "red",
          display: "flex",
          justifyContent: "center",
          fontSize: "3rem",
          fontWeight: "700",
          marginTop: "5rem",
        }}
      >
        Profile not found
      </p>
    );

  return (
    <>
      <Sidebar />
      <div className="profile-page">
        <div className="top-header">
          <h1>My Profile</h1>
          <p>Manage your personal information and farming details</p>
        </div>

        <div className="profile-card">
          {/* HEADER */}
          <div className="profile-header">
            <div className="profile-avatar">
              {profileData.profile_image ? (
                <img
                  src={getProfileImageUrl(profileData.profile_image)}
                  alt="Profile"
                />
              ) : (
                profileData.full_name?.slice(0, 2).toUpperCase()
              )}
            </div>

            <div className="profile-info">
              <h2>{profileData.full_name}</h2>
              <p className="specialization">
                {profileData.specialization || "—"}
              </p>
            </div>

            <div className="profile-actions">
              {isEditing && (
                <label className="btn">
                  📸 Change Photo
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleImageChange}
                  />
                </label>
              )}

              <button className="btn edit" onClick={toggleEdit}>
                {isEditing ? "💾 Save" : "✏️ Edit"}
              </button>
            </div>
          </div>

          {/* CONTENT */}
          <div className="profile-content">
            <div className="profile-left">
              <div className="field">
                <strong>Full Name</strong>
                <input
                  type="text"
                  name="full_name"
                  value={profileData.full_name}
                  disabled={!isEditing}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <strong>Email Address</strong>
                <input type="email" value={profileData.email} disabled />
              </div>

              <div className="field">
                <strong>Phone Number</strong>
                <input
                  type="text"
                  name="phone_number"
                  value={profileData.phone_number}
                  disabled={!isEditing}
                  onChange={handleChange}
                />
              </div>

              <div className="field bio-field">
                <strong>Bio</strong>
                <textarea
                  name="bio"
                  value={profileData.bio}
                  disabled={!isEditing}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="profile-right">
              <div className="field">
                <strong>Location</strong>
                <input
                  type="text"
                  name="location"
                  value={profileData.location}
                  disabled={!isEditing}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <strong>Farm Name</strong>
                <input
                  type="text"
                  name="farm_name"
                  value={profileData.farm_name}
                  disabled={!isEditing}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <strong>Specialization</strong>
                <input
                  type="text"
                  name="specialization"
                  value={profileData.specialization}
                  disabled={!isEditing}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* STATS (STYLE UNCHANGED) */}
          <div className="profile-stats">
            <div className="stat-item">
              <span>📅 Member Since</span>
              <p>
                {profileData.member_since
                  ? new Date(profileData.member_since).toLocaleDateString(
                      "en-IN",
                      { year: "numeric", month: "long" }
                    )
                  : "—"}
              </p>
            </div>

            <div className="stat-item">
              <span>🌾 Experience</span>
              {isEditing ? (
                <input
                  type="text"
                  name="experience"
                  value={profileData.experience}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.experience || "—"}</p>
              )}
            </div>

            <div className="stat-item">
              <span>📍 Farm Size</span>
              {isEditing ? (
                <input
                  type="text"
                  name="farm_size"
                  value={profileData.farm_size}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.farm_size || "—"}</p>
              )}
            </div>

            <div className="stat-item">
              <span>🏆 Achievements</span>
              {isEditing ? (
                <input
                  type="number"
                  name="achievements"
                  value={profileData.achievements}
                  onChange={handleChange}
                />
              ) : (
                <p>{profileData.achievements}</p>
              )}
            </div>
          </div>
        </div>
        {showPopup && (
          <div className="popup">
            {popupMessage}
          </div>
        )}
      </div>
    </>
  );
}




//note: This code defines a Profile component for a Crop Recommendation System frontend. 
// It includes editable fields for user information, a sidebar, and styling through SCSS.
//  The component uses React hooks for state management and conditional rendering for edit mode.
// also we need a get api to fetch the profile data from the backend and a put api to update the profile data in the backend.