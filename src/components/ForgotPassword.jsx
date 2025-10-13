import React, { useState } from "react";
import { Mail } from "lucide-react";
import toast from "react-hot-toast";
import axios from "axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/auth/forgot-password`, { email });
      setSent(true);
      toast.success("If this email is registered, a reset link has been sent.");
    } catch (err) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl p-8">
        <div className="flex flex-col items-center mb-6">
          <span className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl shadow-lg mb-2">
            <Mail className="w-7 h-7 text-white" />
          </span>
          <h2 className="text-2xl font-bold text-white mb-2">Forgot Password</h2>
          <p className="text-slate-300 text-center">Enter your email address and we'll send you a link to reset your password.</p>
        </div>
        {sent ? (
          <div className="text-green-400 text-center py-6">Check your inbox for a password reset link.</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="email"
              required
              placeholder="Your email address"
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-purple-400/20 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-400"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !email}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
