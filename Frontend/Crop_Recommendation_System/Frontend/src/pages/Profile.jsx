import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import "../scss/profile.scss";

export default function Profile() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: "Rimi Halder",
    specialization: "Organic Farming",
    location: "Kolkata, West Bengal, India",
    email: "rimi.ex@email.com",
    phone: "+91 98765 43210",
    farmName: "Green Valley Farm",
    bio: "Passionate organic farmer with 1 year of experience in sustainable agriculture. Specialized in crop rotation and natural pest management.",
    memberSince: "March 2020",
    experience: "1 year",
    farmSize: "25 hectares",
    achievements: "4 Awards",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData({ ...profileData, [name]: value });
  };

  const toggleEdit = () => {
    if (isEditing) {
      alert("Profile saved successfully (dummy alert)");
    }
    setIsEditing(!isEditing);
  };

  return (
    <>
      <Sidebar />
      <div className="profile-page">
        <div className="top-header">
          <h1>My Profile</h1>
          <p>Manage your personal information and farming details</p>
        </div>

        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">RH</div>
            <div className="profile-info">
              <h2>{profileData.fullName}</h2>
              <p className="specialization">{profileData.specialization}</p>
            </div>
            <div className="profile-actions">
              <button className="btn">📸 Change Photo</button>
              <button className="btn edit" onClick={toggleEdit}>
                {isEditing ? "💾 Save" : "✏️ Edit"}
              </button>
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-left">
              <div className="field">
                <strong>Full Name</strong>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  disabled={!isEditing}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <strong>Email Address</strong>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  disabled={!isEditing}
                  onChange={handleChange}
                />
              </div>

              <div className="field">
                <strong>Phone Number</strong>
                <input
                  type="text"
                  name="phone"
                  value={profileData.phone}
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
                  name="farmName"
                  value={profileData.farmName}
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

          <div className="profile-stats">
            <div className="stat-item">
              <span>📅 Member Since</span>
              <p>{profileData.memberSince}</p>
            </div>
            <div className="stat-item">
              <span>🌾 Experience</span>
              <p>{profileData.experience}</p>
            </div>
            <div className="stat-item">
              <span>📍 Farm Size</span>
              <p>{profileData.farmSize}</p>
            </div>
            <div className="stat-item">
              <span>🏆 Achievements</span>
              <p>{profileData.achievements}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}



//note: This code defines a Profile component for a Crop Recommendation System frontend. 
// It includes editable fields for user information, a sidebar, and styling through SCSS.
//  The component uses React hooks for state management and conditional rendering for edit mode.
// also we need a get api to fetch the profile data from the backend and a put api to update the profile data in the backend.