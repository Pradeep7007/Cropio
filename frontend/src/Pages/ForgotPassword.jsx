import React, { useState } from "react";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setSubmitted(true);
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#fafbf9] justify-center items-center px-4 py-8"
      style={{ fontFamily: "Lexend, 'Noto Sans', sans-serif" }}
    >
      <div className="w-full max-w-md bg-white border border-[#e2e8e0] rounded-2xl shadow-sm p-6 md:p-8 text-center">
        <h2 className="text-[#131811] text-2xl font-bold mb-2">Reset Password</h2>
        <p className="text-gray-600 text-sm mb-6">
          Enter the email address associated with your account and we will send you password reset instructions.
        </p>

        {submitted ? (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl mb-6">
            If an account exists for <strong>{email}</strong>, a password reset link has been dispatched to your inbox.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-[#131811] text-sm font-semibold mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-4 py-3 text-sm text-[#131811] focus:outline-none focus:border-green-600 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl transition cursor-pointer"
            >
              Send Reset Link
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link to="/login" className="text-green-700 font-semibold text-sm hover:underline">
            ← Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
