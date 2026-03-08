import React, { useState } from "react";

export default function ProviderProfilePage() {
  // Info about individual
  const [provider, setProvider] = useState({
    id: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    role: ""
  });

  return (
    <div className="bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Provider Profile
        </h1>
        {/* Headers of appointments */}
        <div className="mt-6">

        </div>

        {/* Basic information about individual */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Provider Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                First Name
              </p>
              <p className="mt-1 text-sm text-gray-800">{provider.firstName}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Last Name
              </p>
              <p className="mt-1 text-sm text-gray-800">{provider.lastName}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Provider ID
              </p>
              <p className="mt-1 text-sm text-gray-800">{provider.id}</p>
            </div>
          </div>
        </div>
        {/* Basic information about individual */}
        <div className="mt-10 border-t pt-6">

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Age
              </p>
              <p className="mt-1 text-sm text-gray-800">{provider.age}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Gender
              </p>
              <p className="mt-1 text-sm text-gray-800">{provider.gender}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Role
              </p>
              <p className="mt-1 text-sm text-gray-800">{provider.role}</p>
            </div>
          </div>
        </div>        
      </div>
    </div>
  );
}