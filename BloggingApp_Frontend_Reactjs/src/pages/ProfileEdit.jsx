import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetProfileQuery, useUpdateProfileMutation } from "../api/apiSlice";
import Loader from "../components/Loader";

const ProfileEdit = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { data: profile, isLoading, isError } = useGetProfileQuery();
  const [updateProfile, { isLoading: updating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    avatar: null,
  });

  const [completion, setCompletion] = useState(0);

  // Redirect if not logged in
  useEffect(() => {
    if (!token) navigate("/auth/login");
  }, [token, navigate]);

  // Load profile into form
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        avatar: null,
      });
    }
  }, [profile]);

  // Update profile completion live
  useEffect(() => {
    const fields = ["username", "email", "avatar"];
    const filled = fields.filter((f) => formData[f] || (f === "avatar" && profile?.avatar)).length;
    setCompletion(Math.round((filled / fields.length) * 100));
  }, [formData, profile]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (files) setFormData({ ...formData, [name]: files[0] });
    else setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append("username", formData.username);
      data.append("email", formData.email);
      if (formData.avatar) data.append("avatar", formData.avatar);

      await updateProfile(data).unwrap();
      toast.success("Profile updated successfully!");
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to update profile.");
    }
  };

  if (!token || isLoading) return <Loader />;
  if (isError) return <div className="text-center mt-10 text-red-500">Unable to load profile.</div>;

  return (
    <div className="max-w-3xl mx-auto mt-12 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg transition-all">
      <h1 className="text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100">Edit Profile</h1>

      {/* Profile Completion Bar */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Profile Completion</h2>
        <div className="w-full bg-gray-200 dark:bg-gray-700 h-6 rounded-full overflow-hidden">
          <div
            className="h-6 bg-yellow-500 transition-all duration-500"
            style={{ width: `${completion}%` }}
          ></div>
        </div>
        <p className="mt-1 text-gray-600 dark:text-gray-300">{completion}% Complete</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Username */}
        <InputField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
        />

        {/* Email */}
        <InputField
          label="Email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />

        {/* Avatar Upload */}
        <div>
          <label className="block text-gray-700 dark:text-gray-200 mb-2">Avatar</label>
          <input
            type="file"
            name="avatar"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-gray-900 dark:text-gray-100"
          />
          {/* Live Avatar Preview */}
          {formData.avatar ? (
            <img
              src={URL.createObjectURL(formData.avatar)}
              alt="Preview Avatar"
              className="mt-2 w-28 h-28 rounded-full object-cover border border-gray-300 dark:border-gray-600"
            />
          ) : profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Current Avatar"
              className="mt-2 w-28 h-28 rounded-full object-cover border border-gray-300 dark:border-gray-600"
            />
          ) : null}
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={updating}
          className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg shadow-lg transition-all"
        >
          {updating ? "Updating..." : "Update Profile"}
        </button>
      </form>
    </div>
  );
};

const InputField = ({ label, type = "text", name, value, onChange }) => (
  <div>
    <label className="block text-gray-700 dark:text-gray-200 mb-2">{label}</label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
      required
    />
  </div>
);

export default ProfileEdit;
