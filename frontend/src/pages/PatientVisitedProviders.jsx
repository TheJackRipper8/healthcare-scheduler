import React, { useEffect, useState } from "react";
import { auth } from "../firebase";

export default function PatientVisitedProvider()
{
    // List of providers visited by patient
    const [providers, setProviders] = useState([]);
    const [error, setError] = useState("");

    useEffect(() =>
    {
        // Loads provider visited by patient
        async function loadProviders()
        {
            try
            {
                // Check if user authenticated
                if (!auth.currentUser)
                    return;
                // Get user token
                const token = await auth.currentUser.getIdToken(true);
                // Get response
                const res = await fetch("/api/patient/visited-providers", {
                    method: "GET",
                    headers: {
                    Authorization: `Bearer ${token}`
                    }
                });
                // Convert data into response
                const data = await res.json();
                // if response not ok, send error
                if (!res.ok)
                    throw new Error(data.error || "Failed to load providers");

                setProviders(data.providers || []);
                setError("");
            }
            catch (err)
            {
                setError(err.message || "Failed to load providers");
            }
        }

    loadProviders();
    }, []);

    return (
    <div className="min-h-screen bg-gray-100 p-6">
        <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        {/*
            Title
         */}
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
            Visited Providers
        </h1>

        <div className="mt-8 border border-gray-200 rounded-lg p-4">
            {/*
                Display a list of providers visited by patient
             */}
            {providers.length === 0 ? (
            <div className="text-sm text-gray-600 text-center">
                No visited providers found
            </div>
            ) : (
            <ul className="space-y-2">
                <li className="grid grid-cols-3 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2">
                <span>Provider</span>
                <span>Clinic</span>
                <span>Completed Visits</span>
                </li>

                {providers.map((provider) => (
                <li
                    key={`${provider.providerId}-${provider.clinic}`}
                    className="grid grid-cols-3 gap-2 text-sm text-gray-800 border rounded-md p-3"
                >
                    <span>{provider.providerName}</span>
                    <span>{provider.clinic}</span>
                    <span>{provider.completedVisits}</span>
                </li>
                ))}
            </ul>
            )}
        </div>
        </div>
    </div>
    );
}