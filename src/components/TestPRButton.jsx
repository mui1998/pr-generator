import React, { useState } from "react";
import axios from "axios";

export default function TestPRButton() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  const handleTestPR = async () => {
    setLoading(true);
    setResult("");

    try {
      const token = localStorage.getItem("token"); // إذا عندك نظام تسجيل دخول
      const testData = {
        requesterName: "Test User",
        department: "Health",
        location: "Raqqa",
        uprn: "U123TEST",
        estimatedAmount: 999,
        date: new Date().toISOString().split("T")[0]
      };

      const res = await axios.post("http://localhost:5000/api/prs", testData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setResult(`✅ PR Created Successfully! Code: ${res.data.code}`);
      console.log("Response:", res.data);
    } catch (err) {
      console.error("Error creating test PR:", err);
      setResult(`❌ ${err.response?.data?.message || "Failed to create PR"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 flex flex-col items-center space-y-4">
      <button
        onClick={handleTestPR}
        disabled={loading}
        className="bg-sky-700 hover:bg-sky-800 text-white font-semibold px-6 py-3 rounded-xl transition"
      >
        {loading ? "Testing..." : "Run Test PR"}
      </button>

      {result && (
        <div
          className={`mt-3 text-center text-lg font-medium ${
            result.startsWith("✅") ? "text-green-600" : "text-red-600"
          }`}
        >
          {result}
        </div>
      )}
    </div>
  );
}
