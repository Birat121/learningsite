import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom"; 
import toast from "react-hot-toast";


const AuthPage = () => {
  const [isSignIn, setIsSignIn] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const url = isSignIn ? "/auth/login" : "/auth/register";
      const payload = isSignIn
        ? { email: formData.email, password: formData.password }
        : formData;
    
      const res = await axiosInstance.post(url, payload, {
        withCredentials: true,
      });
    
      toast.success(isSignIn ? "Logged in successfully!" : "Account created successfully!");
    
      if (isSignIn) {
        login(res.data.token);
        navigate("/");
      }
    
      setFormData({ name: "", email: "", password: "" });
      setIsSignIn(true);
    
    } catch (err) {
      console.error(err);
      const message = err.response?.data?.message || "Something went wrong.";
      setError(message);
      toast.error(message);
    }
    
     finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
 // Redirect to backend Google OAuth route
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
              onClick={() => setIsSignIn(!isSignIn)}
              className="font-medium text-blue-600 hover:text-blue-500"
            >
              {isSignIn ? "Create an account" : "Sign in"}
            </button>
          </p>
        </div>

        <div className="bg-white py-6 px-4 sm:px-8 shadow sm:rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isSignIn && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter your full name"
                  className="mt-1 w-full px-3 py-2 border rounded-md text-sm border-gray-300"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-gray-900">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />
                  <span className="ml-2">Remember me</span>
                </label>
                <a href="#" className="text-sm text-blue-600 hover:text-blue-500 font-medium">
                  Forgot your password?
                </a>
              </div>
            )}

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 text-sm font-medium rounded-md text-white bg-[rgb(0,104,80)] hover:bg-green-800"
              >
                {loading ? "Please wait..." : isSignIn ? "Sign in" : "Create account"}
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
                <span className="text-sm text-gray-700 font-medium">Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;