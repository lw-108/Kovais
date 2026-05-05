import React, { useState, useEffect } from "react";
import "./Profile.css";

// Placeholder avatar
import avatarPlaceholder from "./placeholderlogo.svg";

function Profile({ user, setUser }) {
  const [userData, setUserData] = useState({
    name: "",
    customer_id: "",
    phone_number: "",
    address: "",
    date_of_birth: "",
    marriage_date: "",
    marital_status: "",
    blood_group: "",
    aadhar: null,
    profile_image: null,
  });
  const [aadharPreview, setAadharPreview] = useState(null);
  const [profilePreview, setProfilePreview] = useState(avatarPlaceholder);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    console.log(storedUser)
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserData({
        name: parsedUser.name || "",
        customer_id: parsedUser.customer_id || "",
        phone_number: parsedUser.phone_number || "",
        address: parsedUser.address || "",
        date_of_birth: parsedUser.date_of_birth || "",
        marriage_date: parsedUser.marriage_date || "",
        marital_status: parsedUser.marital_status || "",
        blood_group: parsedUser.blood_group || "",
        aadhar: parsedUser.aadhar || null,
        profile_image: parsedUser.profile_image || null,
      });
      if (parsedUser.aadhar && typeof parsedUser.aadhar === "string") {
        setAadharPreview(`https://api.codingboss.in/kovais/${parsedUser.aadhar}`);
      }
      if (parsedUser.profile_image && typeof parsedUser.profile_image === "string") {
        setProfilePreview(`https://api.codingboss.in/kovais/${parsedUser.profile_image}`);
      }
    }


  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));

    if (name === "marital_status" && value === "Single") {
      setUserData((prev) => ({ ...prev, marriage_date: "" }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert("Please upload only JPG, JPEG, or PNG images for Aadhar");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }

      setIsVerifying(true);
      setVerificationStatus("Verifying Aadhar...");

      setUserData((prev) => ({ ...prev, aadhar: file }));
      setAadharPreview(URL.createObjectURL(file));

      // Simulate verification process
      setTimeout(() => {
        setIsVerifying(false);
        setVerificationStatus("Aadhar verified successfully");
        setTimeout(() => setVerificationStatus(""), 3000);
      }, 2000);
    }
  };

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
      if (!validTypes.includes(file.type)) {
        alert("Please upload only JPG, JPEG, or PNG images");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        alert("File size should not exceed 5MB");
        return;
      }

      setUserData((prev) => ({ ...prev, profile_image: file }));
      setProfilePreview(URL.createObjectURL(file));
    }
  };

  useEffect(() => {
    const userId = JSON.stringify(localStorage.getItem("currentUserId"))
    console.log("Saving user data for ID:", userId)
  }, [])

  const handleSave = async () => {
    // console.log("Saving user data for ID:", userId)
    const userId = user?.user_id
    console.log("Saving user data for ID:", userId)
    const formData = new FormData();
    formData.append("name", userData.name);
    formData.append("phone_number", userData.phone_number);
    formData.append("address", userData.address);
    formData.append("date_of_birth", userData.date_of_birth);
    formData.append("marriage_date", userData.marriage_date);
    formData.append("marital_status", userData.marital_status);
    formData.append("blood_group", userData.blood_group);
    // formData.append("customer_id", userId)

    if (userData.aadhar instanceof File) {
      formData.append("aadhar", userData.aadhar);
    }

    if (userData.profile_image instanceof File) {
      formData.append("profile_image", userData.profile_image);
    }

    try {
      const response = await fetch(
        `https://api.codingboss.in/kovais/update-customer/?customer_id=${userId}`,
        // `https://588057ce4a7a.ngrok-free.app/kovais/update-customer/?customer_id=${userId}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (response.ok) {
        alert("Profile updated successfully!");
        const updatedUser = { ...userData };
        if (updatedUser.aadhar instanceof File) {
          updatedUser.aadhar = "/uploads/your-aadhar-path.jpg";
        }
        if (updatedUser.profile_image instanceof File) {
          updatedUser.profile_image = "/uploads/your-profile-path.jpg";
        }
        localStorage.setItem("loggedInUser", JSON.stringify(updatedUser));
      } else {
        alert("Error updating profile. Please check all fields.");
      }
    } catch (err) {
      alert("Network error. Please try again later.");
    }
  };

  return (
    <>
      <div className="profile-page">
        <div className="profile-container">
          {/* Header */}
          <div className="profile-header">
            <div className="avatar-container">
              <img
                src={profilePreview}
                alt="Profile"
                className="avatar-image"
              />
              <label htmlFor="profile-upload" className="upload-overlay">
                +
              </label>
              <input
                id="profile-upload"
                type="file"
                accept=".jpg,.jpeg,.png"
                onChange={handleProfileImageChange}
                style={{ display: "none" }}
              />
            </div>
            <h2 className="profile-title">Profile Information</h2>
            <p className="profile-subtitle">Manage your personal details</p>
          </div>

          {/* Form */}
          <div className="form-grid">
            {/* Name */}
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-input"
                name="name"
                value={userData.name}
                onChange={handleChange}
                placeholder="Enter your name"
              />
            </div>

            {/* Phone */}
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input
                type="tel"
                className="form-input"
                name="phone_number"
                value={userData.phone_number}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            {/* Date of Birth */}
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input
                type="date"
                className="form-input"
                name="date_of_birth"
                value={userData.date_of_birth}
                onChange={handleChange}
              />
            </div>

            {/* Blood Group */}
            <div className="form-group">
              <label className="form-label">Blood Group</label>
              <select
                className="form-select"
                name="blood_group"
                value={userData.blood_group}
                onChange={handleChange}
              >
                <option value="">Select Blood Group</option>
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
              </select>
            </div>

            {/* Marital Status */}
            <div className="form-group">
              <label className="form-label">Marital Status</label>
              <select
                className="form-select"
                name="marital_status"
                value={userData.marital_status}
                onChange={handleChange}
              >
                <option value="">Select Status</option>
                <option value="Single">Single</option>
                <option value="Married">Married</option>
                <option value="Divorced">Divorced</option>
                <option value="Widowed">Widowed</option>
              </select>
            </div>

            {/* Marriage Date */}
            <div className="form-group">
              <label className="form-label">Marriage Date</label>
              <input
                type="date"
                className="form-input"
                name="marriage_date"
                value={userData.marriage_date}
                onChange={handleChange}
                disabled={userData.marital_status !== "Married"}
              />
              {userData.marital_status !== "Married" && (
                <span className="helper-text">Available only when married</span>
              )}
            </div>

            {/* Address */}
            <div className="form-group full-width">
              <label className="form-label">Address</label>
              <textarea
                className="form-textarea"
                name="address"
                value={userData.address}
                onChange={handleChange}
                placeholder="Enter your complete address"
              />
            </div>

            {/* Aadhar Upload */}
            <div className="form-group full-width">
              <label className="form-label">Aadhar Card</label>
              <div className="file-upload-area">
                <label htmlFor="aadhar-upload" className="file-label">
                  Choose File
                </label>
                <input
                  id="aadhar-upload"
                  type="file"
                  accept=".jpg,.jpeg,.png"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <div className="file-info">
                  Accepted formats: JPG, JPEG, PNG (Max: 5MB)
                </div>
              </div>

              {/* Verification Status */}
              {isVerifying && (
                <div className="verification-status verifying">
                  {verificationStatus}
                </div>
              )}
              {!isVerifying && verificationStatus && (
                <div className="verification-status success">
                  {verificationStatus}
                </div>
              )}

              {/* Preview */}
              {aadharPreview && (
                <div className="image-preview">
                  <img
                    src={aadharPreview}
                    alt="Aadhar Preview"
                    className="preview-image"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Save Button */}
          <button className="save-button" onClick={handleSave}>
            Save Profile
          </button>
        </div>
      </div>
    </>
  );
}

export default Profile;