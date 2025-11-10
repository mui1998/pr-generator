import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ onLogin, onRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const handleLogin = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!email || !password) {
      setError("Please fill in both email and password.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      // Use environment variable or fallback to localhost
      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

      // Send credentials to backend
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });

      // Extract data
      const { token, user } = res.data;

      // Save token and user info
      localStorage.setItem("token", token);
      localStorage.setItem("userName", user.name || "");

      // Set default Authorization header for all future requests
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Notify parent component
      if (onLogin) onLogin(true);

      // Optional: redirect (if using React Router)
      // navigate("/dashboard");

    } catch (err) {
      console.error("Login error:", err);
      setError(
        err.response?.data?.error || err.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-800 to-cyan-600 p-4">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://actionforhumanity.org/assets/images/logo-white.png"
            alt="Action For Humanity"
            className="h-16 mb-2 bg-sky-900 rounded-md p-2"
          />
          <h2 className="text-2xl font-bold text-sky-900">
            Raqqa Office Portal
          </h2>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-600"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-sky-600"
          />

          {error && <div className="text-red-600 text-center text-sm">{error}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Don’t have an account?{" "}
          <button
            type="button"
            onClick={() => onRegister && onRegister()}
            className="text-sky-700 font-medium hover:underline"
          >
            Register
          </button>
        </p>

        <p className="text-center text-gray-500 text-sm mt-4">
          © {new Date().getFullYear()} Action For Humanity
        </p>
      </div>
    </div>
  );
}
