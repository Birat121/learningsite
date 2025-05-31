import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleReset = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    try {
      const { data } = await axiosInstance.post(`/auth/reset-password/${token}`, { password });
      setMessage(data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired token");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 mb-20 p-6 shadow-lg border border-gray-200 rounded-lg bg-white">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Reset Password</h2>
      <form onSubmit={handleReset} className="space-y-5">
        <input
          type="password"
          placeholder="New password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        />
        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          required
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
        />
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-md font-medium hover:bg-green-700 transition"
        >
          Reset Password
        </button>
      </form>
      {message && <p className="mt-6 text-green-600 text-center font-medium">{message}</p>}
      {error && <p className="mt-6 text-red-600 text-center font-medium">{error}</p>}
    </div>
  );
};

export default ResetPassword;
