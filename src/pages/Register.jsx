import React, { useState } from "react";
import axios from "axios";

export default function Register({ onRegisterSuccess }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
const handleSubmit = async (e) => {
  e.preventDefault(); // Prevent page reload
  setError("");
  setMessage("");

  // ✅ Basic client-side validation
  if (!name || !email || !password || !confirmPassword) {
    setError("All fields are required.");
    return;
  }

  // ✅ Password match validation
  if (password !== confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  // ✅ Optional: Password strength check
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  if (!passwordRegex.test(password)) {
    setError("Password must be at least 6 characters and include letters and numbers.");
    return;
  }

  try {
    setLoading(true);

    const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

    // 🔹 Send registration request
    const res = await axios.post(`${API_URL}/auth/register`, {
      name,
      email,
      password,
    });

    // ✅ Success feedback
    setMessage(res.data?.message || "Registration successful! You can now log in.");

    // ✅ Call optional callback to notify parent component
    onRegisterSuccess && onRegisterSuccess();

    // ✅ Optional: Clear input fields
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

  } catch (err) {
    console.error("Registration error:", err);

    // 🔹 Handle specific backend errors or fallback
    const backendError = err.response?.data?.error;
    if (backendError) {
      setError(backendError);
    } else if (err.message) {
      setError(err.message);
    } else {
      setError("Registration failed. Please try again.");
    }
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
            Register New Account
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="password"
            placeholder="Password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />

          {error && <div className="text-red-600 text-sm">{error}</div>}
          {message && <div className="text-green-600 text-sm">{message}</div>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-sky-700 hover:bg-sky-800 text-white font-semibold py-2 rounded-lg transition"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-gray-500 text-sm mt-4">
          Already have an account?{" "}
          <a href="/" className="text-sky-700 font-medium hover:underline">
            Login
          </a>
        </p>

        <p className="text-center text-gray-500 text-sm mt-2">
          © {new Date().getFullYear()} Action For Humanity
        </p>
      </div>
    </div>
  );
}
