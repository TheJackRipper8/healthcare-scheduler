import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function ProviderPatientDatabase() {
  const [patients, setPatients] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Loads patient for a provider
    async function loadPatients() {
      try 
      {
        // Check user authenticaiton
        if (!auth.currentUser) 
            return;
        // Get user authentication token
        const token = await auth.currentUser.getIdToken(true);
        // Fetch response using api handler using token
        const res = await fetch("/api/provider/patients", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Convert response into token
        const data = await res.json();
        // Check if response is ok
        if (!res.ok)
          throw new Error(data.error || "Failed to load patients");
        // set patients for a provider
        setPatients(data.patients || []);
        setError("");
      } 
      catch (err) 
      {
        setError(err.message || "Failed to load patients");
      }
    }

    loadPatients();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Provider Patients
        </h1>

        <div className="mt-8 border border-gray-200 rounded-lg p-4">
          {patients.length === 0 ? (
            <div className="text-sm text-gray-600 text-center">
              No patients found
            </div>
          ) : (
            // {/* Display a list of patients for a provider */}
            <ul className="space-y-2">
              <li className="grid grid-cols-5 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2">
                <span>First Name</span>
                <span>Last Name</span>
                <span>Age</span>
                <span>Gender</span>
                <span>Patient ID</span>
              </li>

              {patients.map((patient) => (
                <li
                  key={patient.id}
                  className="grid grid-cols-5 gap-2 text-sm text-gray-800 border rounded-md p-3"
                >
                  <span>{patient.firstName}</span>
                  <span>{patient.lastName}</span>
                  <span>{patient.age}</span>
                  <span>{patient.gender}</span>
                  <span>{patient.patientId}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}