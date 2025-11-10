import React, { useState, useEffect } from "react";
import axios from "axios";

import PurchaseRequestForm from "../components/PurchaseRequest";

export default function HomePage({ onLogout }) {
  const [prs, setPrs] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
   const [loading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState({
    department: "",
    requester: "",
    location: "",
    search: "",
  });
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch PRs

const fetchPrs = async () => {
  try {
    setIsLoading(true); // Start loading
    const token = localStorage.getItem('token');
    if (!token) throw new Error('No token found');

    const res = await axios.get('http://localhost:3000/api/pr', {
      headers: { Authorization: `Bearer ${token}` }
    });

    setPrs(res.data);
  } catch (err) {
    console.error('Error fetching PRs:', err);
    console.log('Failed to fetch Purchase Requests.');
  } finally {
    setIsLoading(false); // Stop loading
  }
};


  useEffect(() => {
    fetchPrs();
  }, [page, filters]);

  // ✅ Filter
  const handleFilterChange = (e) => {
    setPage(1);
    setFilters((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // ✅ Export to Excel
  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(prs);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "PurchaseRequests");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(
      blob,
      `PurchaseRequests_${new Date().toISOString().split("T")[0]}.xlsx`
    );
  };

  // ✅ Export to CSV
 const exportToCSV = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/api/pr/export/csv`, {
        responseType: "blob",
      });

      const blob = new Blob([response.data], { type: "text/csv" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "purchase_requests.csv";
      link.click();
      URL.revokeObjectURL(link.href);
    } catch (error) {
      console.error("Export CSV failed:", error);
    }
  };
  // ✅ Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    onLogout(); // Redirects to login page
  };

 const handleFormSubmit = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:3000/api/pr/create", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setShowForm(false); // close modal
    fetchPrs(); // refresh PR table
  } catch (err) {
    console.error("Error submitting PR:", err);
    alert("Failed to submit purchase request.");
  }
};


  return (
    <div className="min-h-screen bg-gray-50 p-6 relative">
     
      {/* Header */}
      <header className="flex flex-wrap justify-between items-center mb-6 bg-white p-4 rounded-lg shadow">
        <div className="flex gap-5 items-center">
          <img
            src="https://actionforhumanity.org/assets/images/logo-black.png"
            alt="AFH Logo"
            className="h-10"
          />
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Purchase Requests Dashboard
            </h1>
            <p className="text-gray-500">
              Welcome, {localStorage.getItem("userName")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={exportToCSV}
            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-sm"
          >
            Export CSV
          </button>
    
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg text-sm"
          >
            Logout
          </button>
        </div>
      </header>

      {/* PR Table */}
      <div className="bg-white shadow-md rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-600 text-white">
            <tr>
              <th className="p-3">Code</th>
              <th className="p-3">Department</th>
              <th className="p-3">Location</th>
              <th className="p-3">Requester</th>
              <th className="p-3">Estimated Amount</th>
              <th className="p-3">UPRN</th>
              <th className="p-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {prs.length > 0 ? (
              prs.map((pr) => (
                <tr key={pr._id} className="border-b hover:bg-blue-50 transition">
                  <td className="p-3 font-medium text-blue-700">{pr.code}</td>
                  <td className="p-3">{pr.department}</td>
                  <td className="p-3">{pr.location}</td>
                  <td className="p-3">{pr.requester}</td>
                  <td className="p-3">{pr.estimatedAmount} USD</td>
                  <td className="p-3">{pr.uprn}</td>
                  <td className="p-3 text-gray-500">
                    {new Date(pr.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-4 text-center text-gray-500" colSpan="7">
                  No purchase requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center mt-4 space-x-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          ← Prev
        </button>
        <span className="text-gray-700">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
        >
          Next →
        </button>
      </div>

      {/* Floating Add Button */}
      <button
        onClick={() => setShowForm(true)}
        className="fixed bottom-6 right-6 bg-red-600 hover:bg-red-700 text-white rounded-full w-12 h-12 flex  justify-center text-4xl shadow-lg transition-transform"
      >
        +
      </button>
            
      {/* Modal Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 shadow-lg w-full max-w-lg relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-900 text-xl"
            >
              ×
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center text-blue-700">
              New Purchase Request
            </h2>

           <PurchaseRequestForm
            onClose={() => setShowForm(false)}
            onSubmit={handleFormSubmit}
          />
          </div>
        </div>
      )}
    </div>
  );
}
