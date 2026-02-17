// src/pages/Auth/ResetPassword.jsx
import React, { useState, useEffect } from "react";
import { useResetPasswordMutation } from "../../api/apiSlice";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const uid = searchParams.get("uid");
  const token = searchParams.get("token");

  const [resetPassword] = useResetPasswordMutation();

  useEffect(() => {
    if (!uid || !token) {
      toast.error("Invalid password reset link");
      navigate("/auth/forgot-password");
    }
  }, [uid, token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) return toast.error("Please fill both fields");
    if (newPassword !== confirmPassword) return toast.error("Passwords do not match");

    setLoading(true);
    try {
      const res = await resetPassword({ uid, token, new_password: newPassword, confirm_password: confirmPassword }).unwrap();
      toast.success(res.message || "Password reset successful!");
      localStorage.removeItem("token"); // Clear old token
      navigate("/auth/login");
    } catch (err) {
      toast.error(err?.data?.error || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Reset Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="p-2 rounded border border-gray-300 dark:border-gray-600"
          required
        />
        <input
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="p-2 rounded border border-gray-300 dark:border-gray-600"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </div>
  );
}