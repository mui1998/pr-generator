import React, { useState, useEffect } from "react";
import TestPRButton from "./TestPrButton";
const PurchaseRequestForm = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState({
    uprn: "",
    location: "",
    department: "",
    estimatedAmount: "",
    requester: "",
  });

  const locations = ["Raqqa", "Hasakeh", "Deir ez-Zor"];
  const departments = ["Health", "WASH", "Education"];

  // 🧠 Auto-fill requester from logged-in user
  useEffect(() => {
    const userName = localStorage.getItem("userName");
    if (userName) {
      setForm((prev) => ({ ...prev, requester: userName }));
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!form.uprn || !form.location || !form.department || !form.estimatedAmount) {
      alert("Please fill in all required fields!");
      return;
    }

    // Call parent handler to submit to backend
    onSubmit(form);

    // Reset form but keep requester
    setForm({
      uprn: "",
      location: "",
      department: "",
      estimatedAmount: "",
      requester: localStorage.getItem("userName") || "",
    });

    // Close modal
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">New Purchase Request</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-red-600 text-lg">
            ✕
          </button>
          <TestPRButton />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* UPRN */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              UPRN <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="uprn"
              value={form.uprn}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Location <span className="text-red-400">*</span>
            </label>
            <select
              name="location"
              value={form.location}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Location</option>
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Department <span className="text-red-400">*</span>
            </label>
            <select
              name="department"
              value={form.department}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500"
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep} value={dep}>
                  {dep}
                </option>
              ))}
            </select>
          </div>

          {/* Estimated Amount */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Estimated PR Amount (USD) <span className="text-red-400">*</span>
            </label>
            <input
              type="number"
              name="estimatedAmount"
              value={form.estimatedAmount}
              onChange={handleChange}
              required
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-red-500"
            />
          </div>

          {/* Auto-filled Requester */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Requester <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.requester}
              readOnly
              className="w-full border rounded-lg p-2 bg-gray-100 text-gray-700"
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
            >
              Save PR
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PurchaseRequestForm;
