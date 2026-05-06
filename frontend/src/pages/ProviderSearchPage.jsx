import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase";
export default function ProviderSearchPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    insuranceType: "",
    clinic: "",
    specialist: ""
  });
  // Provider results
  // Error handling
  // Loading
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  // Handles searching for providers
  async function handleSearch() {
    // Initializes error and loading
    setError("");
    setLoading(true);

    try 
    {
      // Fetch token
      const token = await auth.currentUser.getIdToken();
      // Construct queies into parameters
      const params = new URLSearchParams({
        insuranceType: form.insuranceType,
        clinic: form.clinic,
        specialist: form.specialist
      });
      // Fetch response using token with parameters
      const res = await fetch(`/api/providers/search?${params.toString()}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Convert reponse into json
      const data = await res.json();
      // If response not ok, send error
      if (!res.ok)
        throw new Error(data.error || "Failed to search providers");

      setResults(data.providers || []);
    } 
    catch (err) 
    {
      setError(err.message || "Failed to search providers");
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
          Provider Search
        </h1>

        {/* Filter based on insurance type, provider, or specialization */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            {/* Insurance query and form setter */}
            <label className="block text-xs font-semibold text-gray-500 uppercase">
              Insurance Type
            </label>
            <input
              type="text"
              value={form.insuranceType}
              onChange={(e) => setForm({ ...form, insuranceType: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter insurance"
            />
          </div>

          <div>
            {/* Clinic query and form setter */}
            <label className="block text-xs font-semibold text-gray-500 uppercase">
              Clinic
            </label>
            <input
              type="text"
              value={form.clinic}
              onChange={(e) => setForm({ ...form, clinic: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter clinic"
            />
          </div>

          <div>
            {/* Specialist query and form setter */}
            <label className="block text-xs font-semibold text-gray-500 uppercase">
              Specialist
            </label>
            <input
              type="text"
              value={form.specialist}
              onChange={(e) => setForm({ ...form, specialist: e.target.value })}
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        {/* Submit query */}
        <div className="mt-6 flex justify-center">
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
                  <span>Specialization</span>
                  <span>Gender</span>
                </li>

                {results.map((provider) => (
                  <li
                    key={provider.id}
                    className="grid grid-cols-3 gap-2 text-sm text-gray-800 border rounded-md p-3 cursor-pointer hover:bg-gray-50"
                    onClick={() =>
                      navigate("/patient/provider_information", {
                        state: { provider }
                      })
                    }
                  >
                    <span className="font-medium">
                      {provider.firstName} {provider.lastName}
                    </span>
                    <span>{provider.specialization || ""}</span>
                    <span>{provider.gender || ""}</span>
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