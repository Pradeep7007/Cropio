import React, { useState } from "react";
import { Link } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const LoginForm = () => {
  const [user, setUser] = useState({
    emailOrusername: "",
    password: "",
    rememberMe: false,
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setUser((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleLogin = () => {
    // Example: you can verify credentials here
    localStorage.setItem("loggedIn", "true");
    localStorage.setItem("user", "Farmer");

    // Notify all tabs/components
    window.dispatchEvent(new Event("loggedInChanged"));
    window.dispatchEvent(new Event("userChanged"));
  };

  return (
    <div
      className="relative flex min-h-screen flex-col bg-[#fafbf9] overflow-x-hidden"
      style={{
        fontFamily: "Lexend, 'Noto Sans', sans-serif",
      }}
    >
      <div className="flex h-full grow flex-col">
        <div className="px-4 md:px-10 flex flex-1 justify-center py-5">
          <div className="flex flex-col w-full max-w-[512px] flex-1 py-5">
            <h2 className="text-[#131811] text-[28px] font-bold leading-tight text-center pb-3 pt-5">
              Welcome back
            </h2>

            <div className="flex flex-wrap items-end gap-4 px-4 py-3 max-w-[480px]">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#131811] text-base font-medium pb-2">Email</p>
                <input
                  name="emailOrusername"
                  placeholder="Enter your email"
                  className="form-input w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] p-[15px] text-base text-[#131811] placeholder-[#6d8560] focus:outline-none focus:ring-0 h-14"
                  type="email"
                  value={user.emailOrusername}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="flex flex-wrap items-end gap-4 px-4 py-3 max-w-[480px]">
              <label className="flex flex-col min-w-40 flex-1">
                <p className="text-[#131811] text-base font-medium pb-2">Password</p>
                <input
                  name="password"
                  placeholder="Enter your password"
                  className="form-input w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] p-[15px] text-base text-[#131811] placeholder-[#6d8560] focus:outline-none focus:ring-0 h-14"
                  type="password"
                  value={user.password}
                  onChange={handleChange}
                />
              </label>
            </div>

            <div className="flex items-center justify-between px-4 min-h-14">
              <label className="flex items-center space-x-2">
                <input
                  name="rememberMe"
                  type="checkbox"
                  checked={user.rememberMe}
                  onChange={handleChange}
                />
                <p className="text-[#131811] text-base font-normal">Remember me</p>
              </label>
              <Link to="/forgotpassword">
                <p className="text-[#6d8560] text-sm underline">Forgot password?</p>
              </Link>
            </div>

            <div className="px-4 py-3">
              <button
                className="w-full h-12 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 cursor-pointer font-bold"
                onClick={handleLogin}
              >
                Log in
              </button>

              <div className="mt-3">
                <GoogleLogin
                  onSuccess={(credentialResponse) => {
                    console.log(credentialResponse);
                  }}
                  onError={() => console.log("Login Failed")}
                  theme="outline"
                  size="large"
                  shape="pill"
                />
              </div>
            </div>

            <p className="text-[#6d8560] text-sm text-center px-4 underline pt-1 pb-3">
              Don't have an account? Sign up
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
