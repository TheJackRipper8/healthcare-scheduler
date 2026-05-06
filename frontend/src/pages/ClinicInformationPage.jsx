import { useAuth } from "../auth/AuthContext";
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { auth } from "../firebase";
export default function ClinicInformationPage() {
  const location = useLocation();
  const passedClinic = location.state?.clinic || null;
  const clinicId = location.state?.clinicId || passedClinic?.id || "";

  const [clinic, setClinic] = useState(
    passedClinic || {
      name: "",
      address: "",
      hours: "",
      appointmentSlotsPerDay: "",
      cancellationPolicy: "",
      insurancesAccepted: "",
      providers: [],
    }
  );

  const [error, setError] = useState("");
  /*
  useEffect(() => {
    // Load clinic information
    async function loadClinic() 
    {
      try 
      {
        // If clinic id does not exist or token failure, return
        if (!clinicId || !auth.currentUser) 
          return;
        // Grab token 
        const token = await auth.currentUser.getIdToken();
        // Get response using token
        const res = await fetch(`/api/clinic/info?clinicId=${clinicId}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Convert response into json
        const data = await res.json();
        // If response not OK, sen derror
        if (!res.ok)
          throw new Error(data.error || "Failed to load clinic information");
        

        setClinic(data.clinic || {});
      } catch (err) {
        setError(err.message || "Failed to load clinic information");
      }
    }

    loadClinic();
  }, [clinicId]);

  */
  return (
    <div className="min-h-screen bg-gray-100 p-6">
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
                {clinic.appointmentSlotsPerDay}
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
              {Array.isArray(clinic.insurancesAccepted) ? clinic.insurancesAccepted.join(", ") : ""}
            </p>
          </div>
        </div>

        {/* Display providers for a given clinic */}
        <div className="mt-10 border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            List of Providers
          </h2>

          <div className="border border-gray-200 rounded-lg p-4">
            <li className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2">
              <span>Name</span>
              <span>Specialization</span>
              <span>Hours</span>
            </li>
            {!clinic.providers || clinic.providers.length === 0 ? (
              // Display the providers that work at the clinic based on name, specialization, and hours
              <p className="text-sm text-gray-600 text-center">No providers listed</p>
            ) : (
              <ul className="space-y-2">
                {(clinic.providers || []).map((p, idx) => (
                  <li
                    key={idx}
                    className="grid grid-cols-3 gap-2 text-sm text-gray-800 border rounded-md p-2"
                  >
                    <span>{p.name || ""}</span>
                    <span>{p.specialization || ""}</span>
                    <span>{p.hours || ""}</span>
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