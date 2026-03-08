import React, { useState } from "react";

export default function ClinicInformationPage() {
  const [clinic, setClinic] = useState({
    name: "",
    address: "",
    hours: "",
    appointmentSlots: "",
    cancellationPolicy: "",
    insurancesAccepted: "",
    providers: [],
  });

  return (
    <div className="bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Clinic Information
        </h1>

        <div className="mt-6"></div>
        {/* Display basic information about clinics */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Clinic Details
          </h2>
          {/* Display name, address, and appointment slots*/}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Name
              </p>
              <p className="mt-1 text-sm text-gray-800">
                {clinic.name}   
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Address
              </p>
              <p className="mt-1 text-sm text-gray-800">
                {clinic.address}
              </p>
            </div>

            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Number of Appointment Slots
              </p>
              <p className="mt-1 text-sm text-gray-800">
                {clinic.appointmentSlots}
              </p>
            </div>
          </div>
        </div>
        {/* Display hours, policy, insurannces accepted */}
        <div className="mt-10 border-t pt-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Hours
              </p>
              <p className="mt-1 text-sm text-gray-800">
                {clinic.hours}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-xs font-semibold text-gray-500 uppercase">
                Cancellation Policy
              </p>
              <p className="mt-1 text-sm text-gray-800">
                {clinic.cancellationPolicy}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Insurances Accepted
          </h2>

          <div className="border border-gray-200 rounded-lg p-4">
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {clinic.insurancesAccepted}
            </p>
          </div>
        </div>

        {/* Display providers for a given clinic */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            List of Providers
          </h2>

          <div className="border border-gray-200 rounded-lg p-4">
            <li className="grid grid-cols-5 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2">
              <span>Name</span>
              <span>Specialization</span>
              <span>Hours</span>
            </li>
            {clinic.providers.length === 0 ? (
              
              <p className="text-sm text-gray-600 text-center">No providers listed</p>
            ) : (
              <ul className="space-y-2">
                {clinic.providers.map((p, idx) => (
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