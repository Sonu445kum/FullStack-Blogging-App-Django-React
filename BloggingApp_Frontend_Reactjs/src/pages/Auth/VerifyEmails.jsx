import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useVerifyEmailMutation } from "../../api/apiSlice";

export default function VerifyEmails({
  successMessage = "Email verified successfully!",
  redirectTo = "/auth/login",
  loadingMessage = "Verifying your email..."
}) {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState({ success: false, message: "" });
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [verifyEmail] = useVerifyEmailMutation();

  useEffect(() => {
    const verify = async () => {
      const uid = searchParams.get("uid");
      const token = searchParams.get("token");

      if (!uid || !token) {
        const msg = "Invalid or missing verification parameters!";
        toast.error(msg);
        setStatus({ success: false, message: msg });
        setLoading(false);
        return;
      }

      try {
        const res = await verifyEmail({ uid, token }).unwrap();
        const msg = res.message || successMessage;
        setStatus({ success: true, message: msg });
        toast.success(msg);

        setTimeout(() => navigate(redirectTo, { replace: true }), 2000);
      } catch (err) {
        const msg = err?.data?.error || "Verification failed!";
        setStatus({ success: false, message: msg });
        toast.error(msg);
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams, navigate, verifyEmail, successMessage, redirectTo]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md text-center w-full max-w-md">
        {loading ? (
          <p className="text-blue-600">{loadingMessage}</p>
        ) : status.success ? (
          <p className="text-green-600">{status.message} Redirecting...</p>
        ) : (
          <p className="text-red-600">{status.message}</p>
        )}
      </div>
    </div>
  );
}
