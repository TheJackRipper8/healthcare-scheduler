import React, { useState } from "react";

export default function PatientProfilePage() {
  // Info about individual
  const [patient, setPatient] = useState({
    id: "",
    firstName: "",
    lastName: "",
    age: "",
    gender: "",
    birthday: "",
    preferredClinic: "",
    preferredProvider: "",
    insurancePlan: "",
    role: ""
  });

  return (
    <div className="bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Patient Profile
        </h1>
        {/* Headers of appointments */}
        <div className="mt-6">

        </div>

        {/* Basic information about individual */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Patient Information
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                First Name
              </p>
              <p className="mt-1 text-sm text-gray-800">{patient.firstName}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Last Name
              </p>
              <p className="mt-1 text-sm text-gray-800">{patient.lastName}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Patient ID
              </p>
              <p className="mt-1 text-sm text-gray-800">{patient.id}</p>
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
              <p className="mt-1 text-sm text-gray-800">{patient.firstName}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Gender
              </p>
              <p className="mt-1 text-sm text-gray-800">{patient.lastName}</p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Birthday
              </p>
              <p className="mt-1 text-sm text-gray-800">{patient.id}</p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="mt-6 border border-gray-200 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Preferences
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">
                Preferred Clinic
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={patient.preferredClinic}
                onChange={(e) =>
                setPatient((p) => ({ ...p, preferredClinic: e.target.value }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">
                Preferred Provider
              </label>
              <input
                type="text"
                className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={patient.preferredProvider}
                onChange={(e) =>
                  setPatient((p) => ({
                    ...p,
                    preferredProvider: e.target.value,
                  }))
                }
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase">
                Insurance Plan
              </label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-gray-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={patient.insurancePlan}
              onChange={(e) =>
                setPatient((p) => ({ ...p, insurancePlan: e.target.value }))
              }
            />
            </div>
          </div>
          {/* Save prefence cahnges */}
          <div className="mt-5 flex justify-end">
            <button
              className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            >
              Save Changes
            </button>
          </div>
        </div>          
      </div>
    </div>
  );
}