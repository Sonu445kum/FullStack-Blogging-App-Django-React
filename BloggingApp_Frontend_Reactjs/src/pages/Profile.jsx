import React, { useEffect } from "react";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGetProfileQuery, useGetStatsQuery } from "../api/apiSlice";
import { FaEdit } from "react-icons/fa";

const Profile = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const { data: profile, isLoading: profileLoading, isError: profileError } = useGetProfileQuery();
  const { data: stats, isLoading: statsLoading, isError: statsError } = useGetStatsQuery();

  useEffect(() => {
    if (!token) navigate("/auth/login");
  }, [token, navigate]);

  useEffect(() => {
    if (profileError || statsError) toast.error("Unable to load profile or stats.");
  }, [profileError, statsError]);

  if (!token || profileLoading || statsLoading) return <Loader />;
  if (!profile) return <div className="text-center mt-10 text-red-500">Unable to load profile.</div>;

  const profileCompletion = Math.round(
    ["username", "email"].filter(f => profile[f]).length / 2 * 100
  );

  const statsData = [
    { label: "Total Blogs", value: stats?.total_blogs },
    { label: "Total Comments", value: stats?.total_comments },
    { label: "Total Reactions", value: stats?.total_reactions },
    { label: "Total Users", value: stats?.total_users },
    { label: "Total Notifications", value: stats?.total_notifications },
  ];

  return (
    <div className="max-w-6xl mx-auto mt-12 p-6 bg-white dark:bg-gray-900 rounded-xl shadow-lg transition-all">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">Your Profile</h1>
          <p className="text-gray-600 dark:text-gray-300 mt-1">
            Welcome back, <span className="font-semibold">{profile.username}</span>
          </p>
        </div>
        <button
          onClick={() => navigate("/profile/edit")}
          className="flex items-center gap-2 px-5 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-md transition-all"
        >
          <FaEdit /> Edit Profile
        </button>
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <InfoCard title="Username" value={profile.username} />
        <InfoCard title="Email" value={profile.email} />
        <InfoCard title="Role" value={profile.role} />
        <InfoCard title="Email Verified" value={profile.email_verified ? "Yes" : "No"} />
        <div className="md:col-span-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all">
          <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-200 mb-2">Profile Completion</h2>
          <div className="w-full bg-gray-200 dark:bg-gray-700 h-6 rounded-full overflow-hidden">
            <div
              className="h-6 bg-yellow-500 transition-all duration-700"
              style={{ width: `${profileCompletion}%` }}
            ></div>
          </div>
          <p className="mt-1 text-gray-600 dark:text-gray-300">{profileCompletion}% Complete</p>
        </div>
      </div>

      
    </div>
  );
};

const InfoCard = ({ title, value }) => (
  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg shadow hover:shadow-lg transition-all">
    <h3 className="text-gray-700 dark:text-gray-200 font-semibold">{title}</h3>
    <p className="text-gray-900 dark:text-gray-100 text-lg mt-1">{value}</p>
  </div>
);

// const StatCard = ({ label, count }) => (
//   <div className="p-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-lg shadow-lg text-center text-white hover:scale-105 transform transition-all">
//     <h3 className="font-semibold text-lg">{label}</h3>
//     <p className="text-2xl font-bold mt-1">{count || 0}</p>
//   </div>
// );

export default Profile;
