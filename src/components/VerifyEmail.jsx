import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useVerifyEmailMutation, useResendVerificationMutation } from "../services/authApi";
import { Check, X, Loader2, Mail, Send, ArrowLeft, CheckCircle2 } from "lucide-react";

const VerifyEmail = () => {
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [resendEmail, setResendEmail] = useState("");
  const [resendStatus, setResendStatus] = useState({ message: "", isSuccess: false });

  const location = useLocation();
  const navigate = useNavigate();

  const [verifyEmail] = useVerifyEmailMutation();
  const [resendVerification, { isLoading: isResending }] = useResendVerificationMutation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification link.");
      return;
    }

    const verify = async () => {
      try {
        const res = await verifyEmail({ token }).unwrap();
        setStatus("success");
        setMessage(res?.message || "Email verified successfully!");
        setTimeout(() => navigate("/login"), 2500);
      } catch (err) {
        setStatus("error");
        setMessage(err?.data?.message || err?.data?.error || "Verification failed or link has expired.");
      }
    };

    verify();
  }, [location, navigate, verifyEmail]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!resendEmail.trim()) {
      setResendStatus({ message: "Please enter your email address", isSuccess: false });
      return;
    }

    setResendStatus({ message: "", isSuccess: false });
    try {
      const res = await resendVerification({ email: resendEmail.trim() }).unwrap();
      setResendStatus({
        message: res?.message || "A new verification email has been sent. Please check your inbox.",
        isSuccess: true,
      });
    } catch (err) {
      setResendStatus({
        message: err?.data?.message || err?.data?.error || "Failed to resend verification link.",
        isSuccess: false,
      });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
      <div className="w-full max-w-md bg-white dark:bg-slate-800 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-3xl p-8 shadow-2xl text-center">
        {status === "loading" && (
          <div className="py-8 flex flex-col items-center gap-4">
            <Loader2 className="animate-spin w-12 h-12 text-purple-600" />
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Verifying your email</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">Please wait while we verify your account...</p>
          </div>
        )}

        {status === "success" && (
          <div className="py-8 flex flex-col items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-100 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center">
              <Check className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Email Verified!</h2>
            <p className="text-sm text-gray-600 dark:text-gray-300">{message}</p>
            <p className="text-xs text-gray-400 mt-2">Redirecting to login in a moment...</p>
            <Link
              to="/login"
              className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-purple-600 hover:bg-purple-700 text-white transition-colors"
            >
              Go to Login
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="py-4 flex flex-col items-center">
            <div className="w-14 h-14 rounded-full bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-400 flex items-center justify-center mb-4">
              <X className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Verification Failed</h2>
            <p className="text-sm text-red-600 dark:text-red-400 mb-6">{message}</p>

            <div className="w-full text-left bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-1">
                Need a new verification link?
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
                Enter your registered email address and we'll send you another verification link.
              </p>

              <form onSubmit={handleResend} className="space-y-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={resendEmail}
                    onChange={(e) => setResendEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="block w-full pl-10 pr-3 py-2.5 text-sm bg-white dark:bg-slate-900 border border-gray-300 dark:border-white/10 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isResending}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-semibold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white transition-all disabled:opacity-50"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sending link...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      Resend Verification Link
                    </>
                  )}
                </button>
              </form>

              {resendStatus.message && (
                <div
                  className={`mt-3 p-3 rounded-xl text-xs flex items-center gap-2 ${
                    resendStatus.isSuccess
                      ? "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-200"
                      : "bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200"
                  }`}
                >
                  {resendStatus.isSuccess ? (
                    <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                  ) : (
                    <X className="w-4 h-4 flex-shrink-0" />
                  )}
                  <span>{resendStatus.message}</span>
                </div>
              )}
            </div>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 text-sm text-purple-600 dark:text-purple-400 hover:underline"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default VerifyEmail;
