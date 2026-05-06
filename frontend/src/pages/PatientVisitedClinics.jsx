import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function PatientVisitedClinics()
{
  // Clinics visited by patient
  const [clinics, setClinics] = useState([]);
  const [error, setError] = useState("");

  useEffect(() =>
  {
    // Load clinics viisted by patient
    async function loadClinics()
    {
      try
      {
        // Check for authentication
        if (!auth.currentUser)
          return;
        // Get token
        const token = await auth.currentUser.getIdToken(true);
        // Fetch response
        const res = await fetch("/api/patient/visited-clinics", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Convert response into data
        const data = await res.json();
        // if response not ok, send error
        if (!res.ok)
          throw new Error(data.error || "Failed to load clinics");

        setClinics(data.clinics || []);
        setError("");
      }
      catch (err)
      {
        setError(err.message || "Failed to load clinics");
      }
    }

    loadClinics();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        {/*
          Title
         */}
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Visited Clinics
        </h1>

        <div className="mt-8 border border-gray-200 rounded-lg p-4">
          {/*
            Display a list of clinics visited by patient
           */}
          {clinics.length === 0 ? (
            <div className="text-sm text-gray-600 text-center">
              No visited clinics found
            </div>
          ) : (
            <ul className="space-y-2">
              <li className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2">
                <span>Clinic</span>
                <span>Address</span>
                <span>Completed Visits</span>
              </li>

              {clinics.map((clinic) => (
                <li
                  key={clinic.clinicId || clinic.id}
                  className="grid grid-cols-3 gap-2 text-sm text-gray-800 border rounded-md p-3"
                >
                  <span>{clinic.name}</span>
                  <span>{clinic.address}</span>
                  <span>{clinic.completedVisits}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}