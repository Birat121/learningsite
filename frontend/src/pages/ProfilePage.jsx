import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const ProfilePage = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "",
  });

  if (!user) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center text-gray-600 text-xl">
        Loading user details...
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSave = () => {
    // 🔒 Call API to save updated user details (implement later)
    console.log("Saving user:", formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      name: user.name,
      email: user.email,
      
    });
    setIsEditing(false);
  };

  return (
    <div className="min-h-[80vh] px-4 pt-36 pb-12 bg-gray-50 flex justify-center">
      <div className="w-full max-w-xl bg-white p-8 rounded-xl shadow-lg">
        <h2 className="text-3xl font-bold mb-8 text-center text-[rgb(0,104,80)]">👤 My Profile</h2>

        <div className="space-y-6">
          {["name", "email", "phone", "role"].map((field) => (
            <div key={field}>
              <label className="block text-gray-600 font-medium mb-1 capitalize">
                {field === "role" ? "User Role" : field === "name" ? "Full Name" : field}
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[rgb(0,104,80)]"
                />
              ) : (
                <div className="p-3 border border-gray-300 rounded-md bg-gray-100 capitalize">
                  {formData[field] || <span className="text-gray-400">Not provided</span>}
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 flex justify-center gap-4">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-[rgb(0,104,80)] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[rgb(0,104,80)] text-white px-6 py-2 rounded-md hover:bg-opacity-90 transition"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
