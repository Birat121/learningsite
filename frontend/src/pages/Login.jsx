import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      return setError("Please enter a valid email address.");
    }
    if (formData.password.length < 6) {
      return setError("Password must be at least 6 characters long.");
    }
    if (!isSignIn && formData.name.trim().length < 3) {
      return setError("Name must be at least 3 characters.");
    }

    setLoading(true);
    const loadingToast = toast.loading(
      isSignIn ? "Logging in..." : "Creating account..."
    );

    try {
      const url = isSignIn ? "/auth/login" : "/auth/register";
      const payload = isSignIn
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await axiosInstance.post(url, payload, {
        withCredentials: true,
      });

      toast.dismiss(loadingToast);

      if (isSignIn) {
        // If logging in, proceed as before
        toast.success("Logged in successfully!");
        await login(res.data.token, res.data.user);
        navigate("/courses");
      } else {
        // If registering, show message and redirect to login page
        toast.success(
          "Account created successfully! Please login to access the course."
        );
        navigate("/login");
      }
    } catch (err) {
      toast.dismiss(loadingToast);
      const message = err.response?.data?.message || "Something went wrong.";
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div>
          <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-gray-900">
            {isSignIn ? "Sign in to your account" : "Create a new account"}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsSignIn(!isSignIn);
                setError("");
              }}
              className="font-medium text-blue-600 hover:text-blue-500"
              type="button"
            >
              {isSignIn ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>

        <div className="bg-white py-6 px-4 sm:px-8 shadow sm:rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isSignIn && (
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isSignIn}
                  placeholder="Enter your full name"
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm border-gray-300"
                />
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email address"
                className="mt-1 w-full px-3 py-2 border rounded-md text-sm border-gray-300"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Enter your password"
                className="mt-1 w-full px-3 py-2 border rounded-md text-sm border-gray-300"
              />
            </div>

            {isSignIn && (
              <div className="text-right">
                <button
                  type="button"
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-blue-600 hover:text-blue-500"
                >
                  Forgot your password?
                </button>
              </div>
            )}

            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div>
              <button
                type="submit"
                disabled={
                  loading ||
                  !formData.email ||
                  !formData.password ||
                  (!isSignIn && !formData.name)
                }
                className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-[rgb(0,104,80)] hover:bg-green-800 disabled:opacity-50"
              >
                {loading
                  ? "Please wait..."
                  : isSignIn
                  ? "Sign in"
                  : "Create account"}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="bg-white px-2 text-gray-500">
                  {isSignIn ? "Or sign in with" : "Or sign up with"}
                </span>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={handleGoogleLogin}
                className="flex justify-center items-center gap-2 px-6 py-2 border border-gray-300 rounded-md shadow-sm bg-white hover:bg-gray-50"
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  className="h-5 w-5"
                />
                <span className="text-sm text-gray-700 font-medium">
                  Google
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
