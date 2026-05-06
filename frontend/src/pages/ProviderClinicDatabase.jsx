import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function ProviderClinicDatabase() {
    // Sets clinics for a provider
    const [clinics, setClinics] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
    async function loadClinics() 
    {
        try 
        {
            // Check if user is authenticated
            if (!auth.currentUser) 
                return;
            // Get user authentication token
            const token = await auth.currentUser.getIdToken(true);
            // Grab response using handler api with token
            const res = await fetch("/api/provider/clinics", {
                method: "GET",
                headers: {
                Authorization: `Bearer ${token}`
                }
            });
            // Convert response into usable data
            const data = await res.json();
            // Check if response is OK
            if (!res.ok)
                throw new Error(data.error || "Failed to load clinics");
            // set data for list of clinics
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
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
            Provider Clinics
        </h1>
        {/* Display a list of clinics a provider works at, if any. */}
        <div className="mt-8 border border-gray-200 rounded-lg p-4">
            {clinics.length === 0 ? (
            <div className="text-sm text-gray-600 text-center">
                No clinics found
            </div>
            ) : (
            <ul className="space-y-2">
                <li className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2">
                <span>Name</span>
                <span>Address</span>
                <span>Hours</span>
                </li>
                {/* Map out each clinic */}  
                {clinics.map((clinic) => (
                <li
                    key={clinic.id}
                    className="grid grid-cols-3 gap-2 text-sm text-gray-800 border rounded-md p-3"
                >
                    <span>{clinic.name}</span>
                    <span>{clinic.address}</span>
                    <span>{clinic.hours}</span>
                </li>
                ))}
            </ul>
            )}
        </div>
        </div>
    </div>
    );
}