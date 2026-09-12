import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    emailOrusername: "",
    password: "",
    rememberMe: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setCredentials((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (error) setError("");
  };

  const handleLogin = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    setError("");

    if (!credentials.emailOrusername.trim()) {
      setError("Please enter your email or username.");
      return;
    }
    if (!credentials.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);

    try {
      const authUrl = import.meta.env.VITE_AUTH_API_URL || "http://localhost:5000/api/auth";
      const response = await fetch(`${authUrl}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          emailOrusername: credentials.emailOrusername.trim(),
          password: credentials.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Invalid credentials. Please try again.");
      }

      // Store authentication info
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("token", data.token || "");
      localStorage.setItem("user", data.user?.role || "Farmer");
      localStorage.setItem("userObj", JSON.stringify(data.user || {}));

      if (credentials.rememberMe) {
        localStorage.setItem("rememberedEmail", credentials.emailOrusername);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      // Notify all tabs and components
      window.dispatchEvent(new Event("loggedInChanged"));
      window.dispatchEvent(new Event("userChanged"));

      // Navigate to homepage / role dashboard
      navigate("/");
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
      <div className="flex h-full grow flex-col justify-center items-center px-4 py-8">
        <div className="w-full max-w-[480px] bg-white border border-[#e2e8e0] rounded-2xl shadow-sm p-6 md:p-8">
          <div className="text-center pb-5">
            <h2 className="text-[#131811] text-[28px] font-bold leading-tight">
              Welcome back
            </h2>
            <p className="text-[#4b5563] text-sm mt-1">
              Log in to your Cropio account to continue
            </p>
          </div>

          {error && (
            <div className="mb-5 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl flex items-center gap-2">
              <span className="font-bold">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[#131811] text-sm font-semibold mb-1">
                Email or Username
              </label>
              <input
                name="emailOrusername"
                placeholder="Enter your email or username"
                className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-4 py-3 text-sm md:text-base text-[#131811] placeholder-[#6d8560] focus:outline-none focus:border-green-600 transition"
                type="text"
                value={credentials.emailOrusername}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-[#131811] text-sm font-semibold mb-1">
                Password
              </label>
              <input
                name="password"
                placeholder="Enter your password"
                className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] px-4 py-3 text-sm md:text-base text-[#131811] placeholder-[#6d8560] focus:outline-none focus:border-green-600 transition"
                type="password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={credentials.rememberMe}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-[#d9e1d6] text-green-600 focus:ring-green-500"
                />
                <span className="text-[#131811] text-sm">Remember me</span>
              </label>
              <Link to="/forgotpassword">
                <span className="text-green-700 text-sm font-medium hover:underline">
                  Forgot password?
                </span>
              </Link>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-base transition-all duration-200 shadow-sm ${
                  loading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 active:scale-[0.99] cursor-pointer"
                }`}
              >
                {loading ? "Logging in..." : "Log in"}
              </button>
            </div>

            <div className="pt-2 flex justify-center">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  try {
                    // Quick fallback handling for Google credential
                    localStorage.setItem("loggedIn", "true");
                    localStorage.setItem("user", "Farmer");
                    localStorage.setItem(
                      "userObj",
                      JSON.stringify({ name: "Google User", role: "Farmer" })
                    );
                    window.dispatchEvent(new Event("loggedInChanged"));
                    window.dispatchEvent(new Event("userChanged"));
                    navigate("/");
                  } catch (err) {
                    console.error(err);
                  }
                }}
                onError={() => {
                  setError("Google sign-in was unsuccessful.");
                }}
                theme="outline"
                size="large"
                shape="pill"
                width="100%"
              />
            </div>
          </form>

          <div className="mt-6 text-center text-sm text-[#4b5563] pt-4 border-t border-gray-100">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-green-700 font-semibold hover:underline hover:text-green-800"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
