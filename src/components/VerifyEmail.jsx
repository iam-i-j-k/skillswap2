import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { Check, X, Loader2 } from "lucide-react";

const VerifyEmail = () => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (!token) {
      setStatus("error");
      setMessage("Invalid verification link.");
      return;
    }
    axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/verify-email`, { token })
      .then(res => {
        setStatus("success");
        setMessage(res.data.message || "Email verified successfully!");
        setTimeout(() => navigate("/login"), 2000);
      })
      .catch(err => {
        setStatus("error");
        setMessage(err.response?.data?.message || "Verification failed.");
      });
  }, [location, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh]">
      {status === "loading" && (
        <div className="flex items-center gap-2 text-lg text-gray-700 dark:text-gray-200">
          <Loader2 className="animate-spin w-6 h-6" />
          Verifying your email...
        </div>
      )}
      {status === "success" && (
        <div className="flex items-center gap-2 text-lg text-green-700 dark:text-green-300">
          <Check className="w-6 h-6" />
          {message}
        </div>
      )}
      {status === "error" && (
        <div className="flex items-center gap-2 text-lg text-red-700 dark:text-red-300">
          <X className="w-6 h-6" />
          {message}
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
