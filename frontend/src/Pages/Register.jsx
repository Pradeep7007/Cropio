import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    role: "Farmer",
    agreeTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return { score: 0, text: "None", color: "#d9e1d6", width: "0%" };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 10) score += 1;
    if (/[0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass)) score += 1;
    if (/[^A-Za-z0-9]/.test(pass)) score += 1;

    if (score <= 2) {
      return { score, text: "Weak", color: "#e53935", width: "33%" };
    } else if (score <= 4) {
      return { score, text: "Medium", color: "#fb8c00", width: "66%" };
    } else {
      return { score, text: "Strong", color: "#43a047", width: "100%" };
    }
  };

  const strength = getPasswordStrength(formData.password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.name.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!formData.email.trim()) {
      setError("Please enter your email address.");
      return;
    }
    if (!formData.phone.trim()) {
      setError("Please enter your phone number.");
      return;
    }
    if (formData.phone.trim().length < 10) {
      setError("Phone number must be at least 10 digits.");
      return;
    }
    if (!formData.password) {
      setError("Please enter a password.");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }
    if (!formData.agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setLoading(true);

    try {
      const authUrl = import.meta.env.VITE_AUTH_API_URL || "http://localhost:5000/api/auth";
      const response = await fetch(`${authUrl}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          phone: formData.phone.trim(),
          role: formData.role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed. Please try again.");
      }

      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (err) {
      setError(err.message || "Failed to connect to authentication server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#fafbf9] overflow-x-hidden"
      style={{
        fontFamily: "Lexend, 'Noto Sans', sans-serif",
      }}
    >
      <div className="flex h-full grow flex-col items-center justify-center px-4 md:px-6 py-8">
        <div className="w-full max-w-xl py-5 bg-white shadow-sm border border-[#e2e8e0] rounded-2xl p-6 md:p-8">
          <div className="text-center pb-4">
            <h2 className="text-[#131811] text-[28px] font-bold tracking-tight">
              Create your Cropio account
            </h2>
            <p className="text-[#4b5563] text-sm md:text-base mt-2">
              Join our community of farmers and dealers to optimize agricultural practices and maximize yields.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl flex items-center gap-2">
              <span className="font-bold">✅</span>
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div>
              <label className="block text-[#131811] text-sm font-semibold mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-4 py-3 text-sm md:text-base text-[#131811] placeholder-[#6d8560] focus:outline-none focus:border-green-600 transition"
                required
              />
            </div>

            {/* Email Address */}
            <div>
              <label className="block text-[#131811] text-sm font-semibold mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-4 py-3 text-sm md:text-base text-[#131811] placeholder-[#6d8560] focus:outline-none focus:border-green-600 transition"
                required
              />
            </div>

            {/* Phone Number - Mandatory */}
            <div>
              <label className="block text-[#131811] text-sm font-semibold mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter your 10-digit mobile number"
                className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-4 py-3 text-sm md:text-base text-[#131811] placeholder-[#6d8560] focus:outline-none focus:border-green-600 transition"
                required
              />
            </div>

            {/* Password with Show/Hide */}
            <div>
              <label className="block text-[#131811] text-sm font-semibold mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Create a password (min. 6 characters)"
                  className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] pl-4 pr-12 py-3 text-sm md:text-base text-[#131811] placeholder-[#6d8560] focus:outline-none focus:border-green-600 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700 focus:outline-none p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password with Show/Hide */}
            <div>
              <label className="block text-[#131811] text-sm font-semibold mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm your password"
                  className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] pl-4 pr-12 py-3 text-sm md:text-base text-[#131811] placeholder-[#6d8560] focus:outline-none focus:border-green-600 transition"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700 focus:outline-none p-1"
                  title={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Password Strength Meter */}
            {formData.password && (
              <div className="p-3 bg-gray-50 rounded-xl border border-[#e8ece7]">
                <div className="flex justify-between items-center text-xs font-medium text-[#131811] mb-1">
                  <span>Password Strength:</span>
                  <span style={{ color: strength.color }} className="font-bold">
                    {strength.text}
                  </span>
                </div>
                <div className="w-full bg-[#d9e1d6] h-1.5 rounded-full overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: strength.width,
                      backgroundColor: strength.color,
                    }}
                  />
                </div>
              </div>
            )}

            {/* User Type */}
            <div>
              <label className="block text-[#131811] text-sm font-semibold mb-1">
                Account Type <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-4 py-3 text-sm md:text-base text-[#131811] focus:outline-none focus:border-green-600 transition"
              >
                <option value="Farmer">Farmer (Cultivation, Disease Detection, Advisory)</option>
                <option value="Dealer">Dealer (Marketplace, Logistics, Price Forecasting)</option>
                <option value="Researcher">Researcher</option>
              </select>
            </div>

            {/* Terms Checkbox */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                  className="mt-1 h-4 w-4 rounded border-[#d9e1d6] text-green-600 focus:ring-green-500"
                />
                <span className="text-sm text-[#4b5563]">
                  I agree to the <span className="text-green-700 underline">Terms of Service</span> and{" "}
                  <span className="text-green-700 underline">Privacy Policy</span>.
                </span>
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-3">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-base transition-all duration-200 shadow-sm ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 active:scale-[0.99] cursor-pointer"
                }`}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center text-sm text-[#4b5563] pt-4 border-t border-gray-100">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-green-700 font-semibold hover:underline hover:text-green-800"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
