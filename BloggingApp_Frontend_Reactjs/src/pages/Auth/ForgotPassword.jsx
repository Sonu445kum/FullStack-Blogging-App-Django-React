// src/pages/Auth/ForgotPassword.jsx
import React, { useState } from "react";
import { useForgotPasswordMutation } from "../../api/apiSlice";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [requestReset] = useForgotPasswordMutation();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return toast.error("Email is required");
    setLoading(true);
    try {
      const res = await requestReset({ email }).unwrap();
      toast.success(res.message || "Password reset link sent to email!");
      navigate("/auth/login"); // optional: redirect after sending link
    } catch (err) {
      toast.error(err?.data?.error || "Failed to send reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded shadow">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          type="email"
          placeholder="Your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="p-2 rounded border border-gray-300 dark:border-gray-600"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Sending..." : "Send Reset Link"}
        </button>
      </form>
    </div>
  );
}