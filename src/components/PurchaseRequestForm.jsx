import React, { useState } from "react";

export default function PurchaseRequestForm() {
  const [formData, setFormData] = useState({
    requesterName: "",
    department: "",
    location: "",
    uprn: "",
    estimatedAmount: "",
    date: new Date().toISOString().split("T")[0],
  });

  const [generatedCode, setGeneratedCode] = useState("");

  // Example requester names
  const requesterNames = [
    "Mohammed Haj Hamdo",
    "Asia Haj Mousa",
    "Mohammad Shehada Al Mohammad"
  ];

  const locationCodes = {
    Raqqa: "RQ",
    Hasakeh: "HK",
    DeirEzzor: "DZ",
  };

  const departmentCodes = {
    Health: "HC",
    WASH: "WSH",
    Education: "EDU",
  };

  const generateCode = () => {
    const country = "SY";
    const loc = locationCodes[formData.location] || "LOC";
    const dep = departmentCodes[formData.department] || "DEP";
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const code = `${country}-${loc}-${dep}-${randomNum}`;
    setGeneratedCode(code);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { requesterName, department, location, uprn, estimatedAmount } = formData;

    if (!requesterName || !department || !location || !uprn || !estimatedAmount) {
      alert("Please fill in all required fields.");
      return;
    }

    if (!generatedCode) generateCode();

    const purchaseRequest = {
      ...formData,
      code: generatedCode,
    };

    console.log("Purchase Request:", purchaseRequest);
  
  };

  const handleReset = () => {
    setFormData({
      requesterName: "",
      department: "",
      location: "",
      uprn: "",
      estimatedAmount: "",
      date: new Date().toISOString().split("T")[0],
    });
    setGeneratedCode("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center py-10 px-4 bg-gray-50">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <img
          src="https://actionforhumanity.org/assets/images/logo-black.png"
          alt="Action For Humanity"
          className="w-48 mb-3"
        />
        <h1 className="text-3xl font-bold text-red-700 text-center">
          Purchase Request Form
        </h1>
        <p className="text-gray-500 text-center">
          Logistics Department – Action For Humanity
        </p>
      </div>

      {/* Form Card */}
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Requester Name Dropdown */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Requester Name<span className="text-red-500">*</span>
            </label>
            <select
              name="requesterName"
              value={formData.requesterName}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Requester</option>
              {requesterNames.map((name, idx) => (
                <option key={idx} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>

          {/* Department */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Department<span className="text-red-500">*</span>
            </label>
            <select
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Department</option>
              <option value="Health">Health</option>
              <option value="WASH">WASH</option>
              <option value="Education">Education</option>
            </select>
          </div>

          {/* Location */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Location<span className="text-red-500">*</span>
            </label>
            <select
              name="location"
              value={formData.location}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Location</option>
              <option value="Raqqa">Raqqa</option>
              <option value="Hasakeh">Hasakeh</option>
              <option value="DeirEzzor">Deir Ezzor</option>
            </select>
          </div>

          {/* Request Date */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Request Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* UPRN */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              UPRN<span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="uprn"
              value={formData.uprn}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter UPRN"
            />
          </div>

          {/* Estimated Amount */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1">
              Estimated PR Amount<span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="estimatedAmount"
              value={formData.estimatedAmount}
              onChange={handleChange}
              className="w-full border rounded-lg p-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter estimated amount"
              min="0"
            />
          </div>

          {/* Generated Code */}
          {generatedCode && (
            <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-3 rounded-md text-center">
              <strong>Generated Code:</strong> {generatedCode}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-between pt-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all duration-200"
            >
              Reset
            </button>

            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold shadow-md transition-all duration-200"
            >
              Create Request
            </button>
          </div>
        </form>
      </div>

      <footer className="mt-10 text-sm text-gray-500 text-center">
        © {new Date().getFullYear()} Action For Humanity – Mohammed Aljajan
      </footer>
    </div>
  );
}
