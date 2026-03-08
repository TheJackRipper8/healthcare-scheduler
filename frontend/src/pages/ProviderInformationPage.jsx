import React, { useState } from "react";

export default function ProviderInformationPage() {
  const [provider, setProvider] = useState({
    name: "",
    specialization: "",
    hours: "",
    gender: "",
    age: "",
    insurancesAccepted: "",
    clinics: [],
  });

  return (
    <div className="bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Provider Information
        </h1>

        <div className="mt-6"></div>
        {/* Display basic information about provider */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Provider Details
          </h2>
          {/* Display name, specialization, and working hours*/}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Name
              </p>
              <p className="mt-1 text-sm text-gray-800">
                {provider.name}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Specialist
              </p>
              <p className="mt-1 text-sm text-gray-800">
                {provider.specialization}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Hours
              </p>
              <p className="mt-1 text-sm text-gray-800">
                {provider.hours}
              </p>
            </div>
          </div>
        </div>
        {/* Display gender and age of provider */}
        <div className="mt-10 border-t pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Gender
              </p>
              <p className="mt-1 text-sm text-gray-800">
                {provider.gender}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Age
              </p>
              <p className="mt-1 text-sm text-gray-800">
                {provider.age}
              </p>
            </div>
          </div>
        </div>
        {/* Display clinics for a provider */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            List of Clinics
          </h2>

          <div className="border border-gray-200 rounded-lg p-4">
            {provider.clinics.length === 0 ? (
              <p className="text-sm text-gray-600 text-center">No clinics listed</p>
            ) : (
              // {/* Loop if any clinics for a provider */}
              <ul className="space-y-2">
                <li className="grid grid-cols-5 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2">
                  <span>Name</span>
                  <span>Address</span>
                  <span>Hours</span>
                </li> 
                {provider.clinics.map((p, idx) => (
                
                  <li key={idx} className="text-sm text-gray-800 border rounded-md p-2">
                    {p}
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