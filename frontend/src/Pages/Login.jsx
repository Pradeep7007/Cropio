import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";

const ML_CODE_1 = `import pandas as pd
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report

iris = load_iris()
X = iris.data
y = iris.target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

ovr = LogisticRegression(
    solver='lbfgs', max_iter=1000, multi_class='ovr'
)
ovr.fit(X_train, y_train)

softmax = LogisticRegression(
    solver='lbfgs', max_iter=1000, multi_class='multinomial'
)
softmax.fit(X_train, y_train)

y_pred = softmax.predict(X_test)

report = classification_report(
    y_test, y_pred,
    target_names=iris.target_names,
    output_dict=True
)

df = pd.DataFrame(report).T
df.insert(0, 'sno', range(1, len(df) + 1))

df = df[['sno', 'precision', 'recall', 'f1-score', 'support']]

df.to_csv('submission.csv', index=False)

print(classification_report(
    y_test,
    y_pred,
    target_names=iris.target_names
))`;

const ML_CODE_2 = `import pandas as pd
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression

iris = load_iris()
X = iris.data
y = iris.target

y = (y == 0).astype(int)

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42
)

model = LogisticRegression(
    solver='lbfgs',
    max_iter=1000
)

model.fit(X_train, y_train)

coef = model.coef_[0].round(4)

df = pd.DataFrame({
    'Feature': iris.feature_names,
    'Coefficients': coef
})

df.to_csv('submission.csv', index=False)

print(df)`;

const BOTH_ML_CODES = `# ==============================================================================
# 1. Iris Multiclass Logistic Regression - OvR and Softmax
# ==============================================================================
` + ML_CODE_1 + `


# ==============================================================================
# 2. Iris Logistic Regression - Feature Coefficients
# ==============================================================================
` + ML_CODE_2;

const LoginForm = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    emailOrusername: "",
    password: "",
    rememberMe: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState("");

  const copyCode = async (codeText, id, label) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(codeText);
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = codeText;
        textArea.style.position = "fixed";
        textArea.style.left = "-999999px";
        textArea.style.top = "-999999px";
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        document.execCommand("copy");
        document.body.removeChild(textArea);
      }
      setCopiedId(id);
      setToast(`${label} copied to clipboard!`);
      setTimeout(() => {
        setCopiedId(null);
        setToast("");
      }, 3000);
    } catch (err) {
      console.error("Failed to copy:", err);
      alert("Failed to copy code. Please select and copy manually.");
    }
  };

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
      className="relative min-h-screen bg-[#fafbf9] py-8 px-4"
      style={{
        fontFamily: "Lexend, 'Noto Sans', sans-serif",
      }}
    >
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1e1e1e] text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-green-500 animate-bounce">
          <span className="text-green-400 font-bold text-lg">✓</span>
          <span className="font-medium text-sm">{toast}</span>
        </div>
      )}

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Login Card */}
          <div className="lg:col-span-5 w-full bg-white border border-[#e2e8e0] rounded-2xl shadow-sm p-6 md:p-8">
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
                <div className="relative">
                  <input
                    name="password"
                    placeholder="Enter your password"
                    className="w-full rounded-xl border border-[#d9e1d6] bg-[#fafbf9] pl-4 pr-12 py-3 text-sm md:text-base text-[#131811] placeholder-[#6d8560] focus:outline-none focus:border-green-600 transition"
                    type={showPassword ? "text" : "password"}
                    value={credentials.password}
                    onChange={handleChange}
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

          {/* Right Column: Iris Machine Learning Programs with One-Click Copy */}
          <div className="lg:col-span-7 w-full bg-white border border-[#e2e8e0] rounded-2xl shadow-sm p-6 md:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200 gap-2">
              <div>
                <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>🌸</span> Iris Machine Learning Programs
                </h1>
                <p className="text-gray-500 text-xs md:text-sm mt-1">
                  Click <b>Copy Code</b> to immediately copy full Python code to your clipboard.
                </p>
              </div>
              <a
                href="/iris.html"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 text-xs font-semibold text-green-700 hover:text-green-800 hover:underline bg-green-50 px-2.5 py-1.5 rounded-lg border border-green-200"
              >
                <span>Standalone Page</span>
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            {/* Single Click: Copy Both Codes */}
            <div className="mt-5 p-4 bg-gradient-to-r from-[#1b4332] to-[#2d6a4f] rounded-xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h3 className="font-bold text-base flex items-center gap-2">
                  <span>⚡</span> Copy Both Codes in 1-Click
                </h3>
                <p className="text-green-100 text-xs mt-0.5">
                  Copies both programs (OvR Softmax + Feature Coefficients) directly into your clipboard
                </p>
              </div>
              <button
                type="button"
                onClick={() => copyCode(BOTH_ML_CODES, "both", "Both Python Codes")}
                className={`w-full sm:w-auto px-5 py-2.5 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 shadow ${
                  copiedId === "both"
                    ? "bg-green-300 text-gray-900 scale-105"
                    : "bg-white text-green-950 hover:bg-green-50 active:scale-95"
                }`}
              >
                {copiedId === "both" ? (
                  <>
                    <span>✓</span>
                    <span>Both Codes Copied!</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    <span>Copy Both Codes (1-Click)</span>
                  </>
                )}
              </button>
            </div>

            {/* Program 1 */}
            <div className="mt-6">
              <div className="bg-[#2d6a4f] text-white px-4 py-3 rounded-lg font-semibold text-sm md:text-base flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
                <span>1. Iris Multiclass Logistic Regression - OvR and Softmax</span>
                <button
                  type="button"
                  onClick={() => copyCode(ML_CODE_1, "code1", "Program 1 (OvR and Softmax)")}
                  className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-bold transition flex items-center justify-center gap-1.5 shadow ${
                    copiedId === "code1"
                      ? "bg-green-300 text-gray-900 scale-105"
                      : "bg-white text-green-900 hover:bg-green-50 active:scale-95"
                  }`}
                >
                  {copiedId === "code1" ? (
                    <>
                      <span>✓</span>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative mt-2">
                <pre
                  id="code1"
                  className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-72 border border-gray-800 leading-relaxed scrollbar-thin scrollbar-thumb-gray-600"
                >
                  {ML_CODE_1}
                </pre>
              </div>
            </div>

            {/* Program 2 */}
            <div className="mt-6">
              <div className="bg-[#2d6a4f] text-white px-4 py-3 rounded-lg font-semibold text-sm md:text-base flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
                <span>2. Iris Logistic Regression - Feature Coefficients</span>
                <button
                  type="button"
                  onClick={() => copyCode(ML_CODE_2, "code2", "Program 2 (Feature Coefficients)")}
                  className={`px-3 py-1.5 rounded-md text-xs md:text-sm font-bold transition flex items-center justify-center gap-1.5 shadow ${
                    copiedId === "code2"
                      ? "bg-green-300 text-gray-900 scale-105"
                      : "bg-white text-green-900 hover:bg-green-50 active:scale-95"
                  }`}
                >
                  {copiedId === "code2" ? (
                    <>
                      <span>✓</span>
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative mt-2">
                <pre
                  id="code2"
                  className="bg-[#1e1e1e] text-[#d4d4d4] p-4 rounded-xl text-xs font-mono overflow-x-auto max-h-72 border border-gray-800 leading-relaxed scrollbar-thin scrollbar-thumb-gray-600"
                >
                  {ML_CODE_2}
                </pre>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

