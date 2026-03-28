import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import PhoneAuth from "../store/PhoneAuth";
import { useNavigate } from "react-router-dom";
const LoginRegister = () => {
  const navigate = useNavigate();

  const {
    login,
    register,
    googleLogin,
    error,
    clearError,
    loading: authLoading,
  } = useAuthStore();
  const [activeTab, setActiveTab] = useState("login");
  const [showPhoneAuth, setShowPhoneAuth] = useState(false);
  const [emailLogin, setEmailLogin] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [localError, setLocalError] = useState("");
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (error) {
      setLocalError(error);
      const timer = setTimeout(() => {
        setLocalError("");
        clearError();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, clearError]);
  const handleEmailLogin = async (e) => {
    e.preventDefault();

    if (!emailLogin.email || !emailLogin.password) {
      return setLocalError("Email and password required");
    }

    setFormLoading(true);

    try {
      await login(emailLogin.email, emailLogin.password);
      navigate("/profile");
    } catch (err) {
      setLocalError(err?.message || "Login failed");
    } finally {
      setFormLoading(false);
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerForm.name || !registerForm.email || !registerForm.password) {
      setLocalError("All fields required");
      return;
    }
    if (registerForm.password !== registerForm.confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }
    if (registerForm.password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }
    setFormLoading(true);
    try {
      await register(
        registerForm.name,
        registerForm.email,
        registerForm.password,
      );
    } catch (err) {
      setLocalError(err.response?.data?.message || err.message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Use Google Identity Services
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (!window.google) {
      setLocalError("Google library not loaded");
      return;
    }
    const client = window.google.accounts.oauth2.initTokenClient({
      client_id: clientId,
      scope: "email profile",
      callback: async (tokenResponse) => {
        setFormLoading(true);
        try {
          await googleLogin(tokenResponse.access_token);
        } catch (err) {
          setLocalError(err.response?.data?.message || err.message);
        } finally {
          setFormLoading(false);
        }
      },
    });
    client.requestAccessToken();
  };

  const onPhoneSuccess = () => {
    setShowPhoneAuth(false);
    setLocalError("");
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            AuthFlow
          </h1>
          <p className="text-blue-100 mt-2">Secure access, industry grade</p>
        </div>
        <div className="p-6 sm:p-8">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-xl mb-6">
            <button
              onClick={() => {
                setActiveTab("login");
                setLocalError("");
                setShowPhoneAuth(false);
                clearError();
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "login"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => {
                setActiveTab("register");
                setLocalError("");
                setShowPhoneAuth(false);
                clearError();
              }}
              className={`flex-1 py-2.5 text-sm font-semibold rounded-lg transition-all ${
                activeTab === "register"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              Create Account
            </button>
          </div>

          {localError && (
            <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-3 rounded-lg text-sm flex items-start gap-2">
              <span className="text-red-500">⚠️</span>
              <span>{localError}</span>
            </div>
          )}

          {activeTab === "login" && !showPhoneAuth && (
            <div className="space-y-5">
              <form onSubmit={handleEmailLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    value={emailLogin.email}
                    onChange={(e) =>
                      setEmailLogin({ ...emailLogin, email: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    value={emailLogin.password}
                    onChange={(e) =>
                      setEmailLogin({ ...emailLogin, password: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="••••••••"
                  />
                </div>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="w-full bg-gray-900 hover:bg-black text-white font-semibold py-3 rounded-xl transition-all shadow-sm disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {formLoading && (
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                  )}
                  Sign in with Email
                </button>
              </form>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500">OR</span>
                </div>
              </div>

              <button
                onClick={handleGoogleLogin}
                disabled={formLoading}
                className="w-full flex items-center justify-center gap-3 border border-gray-300 bg-white hover:bg-gray-50 py-3 rounded-xl transition-all font-medium text-gray-700"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </button>

              <button
                onClick={() => {
                  setShowPhoneAuth(true);
                  setLocalError("");
                }}
                className="w-full flex items-center justify-center gap-3 border border-gray-200 bg-gray-50 hover:bg-gray-100 py-3 rounded-xl transition-all font-medium text-gray-700"
              >
                <span className="text-gray-600">📱</span>
                Sign in with Phone
              </button>
            </div>
          )}

          {activeTab === "login" && showPhoneAuth && (
            <PhoneAuth
              onSuccess={onPhoneSuccess}
              onCancel={() => setShowPhoneAuth(false)}
            />
          )}

          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, name: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Alex Johnson"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) =>
                    setRegisterForm({ ...registerForm, email: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="hello@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      password: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Create strong password"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) =>
                    setRegisterForm({
                      ...registerForm,
                      confirmPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Confirm password"
                />
              </div>
              <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-xs text-gray-500 flex items-center gap-2">
                <span className="text-green-600 text-sm">✓</span>
                Role:{" "}
                <span className="font-semibold text-gray-700">
                  Customer
                </span>{" "}
                (permanent)
              </div>
              <button
                type="submit"
                disabled={formLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-all shadow-md disabled:opacity-70 flex items-center justify-center gap-2"
              >
                {formLoading && (
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                )}
                Create Customer Account
              </button>
            </form>
          )}

          <p className="text-center text-xs text-gray-400 mt-8">
            Secure authentication • Industry-level UX
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginRegister;
