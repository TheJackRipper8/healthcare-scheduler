import React, { useState, useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
export default function ClinicSearchPage() {
  const navigate = useNavigate();
  // Query parameters
  const [form, setForm] = useState({
    insuranceType: "",
    provider: "",
    minimumRating: ""
  });

  const [results, setResults] = useState([]);
  // Handles error and loading
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Clinic search
  async function handleSearch() 
  {
    // Set error = "" and loading to true
    setError("");
    setLoading(true);
    
    try 
    {
      // Grab authentication token
      const token = await auth.currentUser.getIdToken();
      // Get response using token with current clinic query parameters
      const res = await fetch("/api/clinic/search", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(form)
      });
      // Convert response into json
      const data = await res.json();
      // If response ok, send error
      if (!res.ok)
        throw new Error(data.error || "Failed to search clinics");
      

      setResults(data.clinics || []);
    } 
    catch (err) 
    {
      setError(err.message || "Failed to search clinics");
    } 
    finally 
    {
      setLoading(false);
    }
  } 
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Clinic Search
        </h1>

        {/* Filter based on insurance type, provider, or rating */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">
              Insurance Type
            </label>
            {/* Form that sets insurance */}
            <input
              type="text"
              value={form.insuranceType}
              onChange={(e) => setForm({ ...form, insuranceType: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter insurance"
            />
          </div>
          {/*Provider query*/}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">
              Provider
            </label>
            {/* Form that sets provider */}
            <input
              type="text"
              value={form.provider}
              onChange={(e) => setForm({ ...form, provider: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter provider"
            />
          </div>
          {/* Minimum rating query */}
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">
              Minimum Rating
            </label>
            {/* Form that sets minimm rating */}
            <input
              type="number"
              value={form.minimumRating}
              onChange={(e) => setForm({ ...form, minimumRating: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        {/* Submit query */}
        <div className="mt-6 flex justify-center">
          {/* Submit with form paramters and set up loading */}
          <button
            onClick={handleSearch}
            disabled={loading}
            className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60"
          >
            {loading ? "Searching..." : "Search"}
          </button>
        </div>

        {/* Dispaly results from the query */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Results
          </h2>

          <div className="border border-gray-200 rounded-lg p-4">
            {results.length === 0 ? (
              <div className="text-center text-gray-600 text-sm">
                No results to display
              </div>
            ) : (
              <ul className="space-y-2">
                <li className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2">
                  <span>Name</span>
                  <span>Address</span>
                  <span>Rating</span>
                </li>

                {results.map((clinic) => (
                  <li
                    key={clinic.id}
                    className="grid grid-cols-3 gap-2 text-sm text-gray-800 border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      navigate("/patient/clinic_information", {
                        state: { clinic }
                      })
                    }
                  >
                    <span className="font-medium">{clinic.name}</span>
                    <span>{clinic.address}</span>
                    <span>{clinic.rating ?? "N/A"}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}