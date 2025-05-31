import { useState } from "react";
import axiosInstance from "../api/axiosInstance";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await axiosInstance.post("/auth/forgot-password", { email });
      setMessage(data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-48 mb-44 p-6 shadow-lg border border-gray-200 rounded-lg bg-white">
      <h2 className="text-3xl font-semibold mb-6 text-center text-gray-800">Forgot Password</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
        />
        <button
          type="submit"
          className="w-full bg-[rgb(0,104,80)] text-white py-3 rounded-md font-medium  transition"
        >
          Send Reset Link
        </button>
      </form>

      {message && <p className="mt-6 text-green-600 text-center font-medium">{message}</p>}
      {error && <p className="mt-6 text-red-600 text-center font-medium">{error}</p>}
    </div>
  );
};

export default ForgotPassword;
