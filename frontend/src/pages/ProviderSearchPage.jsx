import React from "react";

export default function ProviderSearchPage() {
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Provider Search
        </h1>

        {/* Filter based on insurance type, provider, or specialization */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">
              Insurance Type
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter insurance"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">
              Clinic
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter provider"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase">
              Specialist
            </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>
        {/* Submit query */}
        <div className="mt-6 flex justify-center">
          <button className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
            Search
          </button>
        </div>

        {/* Dispaly results from the query */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Results
          </h2>

          <div className="border border-gray-200 rounded-lg p-4 text-center text-gray-600 text-sm">
            No results to display
          </div>
        </div>
      </div>
    </div>
  );
}