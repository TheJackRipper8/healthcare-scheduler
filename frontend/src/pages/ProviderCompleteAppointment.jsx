import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../auth/AuthContext";
  export default function ProviderCompleteAppointmentPage() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDate = new Date().toISOString().slice(0, 10);

  // Appointments to set for that day, error, and loading
  const [appointments, setAppointments] = useState([]);
  const [error, setError] = useState("");
  const [loadingId, setLoadingId] = useState("");
  // Converts Firebase timestamp into AM/PM
  function formatTimeAMPM(value) 
  {
      // No timestamp, return
      if (!value) 
      return "";
      // Create a hour and minute strings
      const [hourStr, minuteStr] = String(value).split(":");
      // Convert hour and minute into numbers
      const hour = Number(hourStr);
      const minute = Number(minuteStr);
      // If neither is a number, return value
      if (Number.isNaN(hour) || Number.isNaN(minute)) 
      return value;
      // Add PM or AM suffix
      const suffix = hour >= 12 ? "PM" : "AM";
      // Convert military time into 12 hour time
      const hour12 = hour % 12 || 12;
      // Format string
      return `${hour12}:${String(minute).padStart(2, "0")} ${suffix}`;
  }  
  useEffect(() => {
    // Load today's appointments to cancel from
    async function loadToday() 
    {
      try 
      {
        console.log('test');
        // If authentication token fail or selected date invalid send error
        if (!auth.currentUser || !selectedDate) 
          return;
        // If retrieve token
        const token = await auth.currentUser.getIdToken();
        // Get response from firebase using token
        let scope = "provider";
        const res = await  fetch(`/api/get-provider-complete-appointment?scope=${scope}`, { //fetch(`/api/get-provider-complete-appointment?selectedDate=${selectedDate}&scope=${scope}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Convert response into json
        const data = await res.json();
        // if response not OK, send error
        if (!res.ok)
          throw new Error(data.error || "Failed to load appointments");
        

        setAppointments(data.appointments || []);
      } 
      catch (err) 
      {
        setError(err.message || "Failed to load appointments");
      }
    }

    loadToday();
  }, [selectedDate]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Completed Appointments
        </h1>
        {/* Headers of appointments */}
        <div className="mt-6">
          <ul className="space-y-2">
            <li className="grid grid-cols-5 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2">
              <span>Provider</span>
              <span>Type</span>
              <span>Date</span>
              <span>Time</span>
              <span>Clinic</span>
            </li>
            {/* Display appointments if any */}
            {appointments.length === 0 ? (
              <li className="text-sm text-gray-600 text-center">
                No appointments for today
              </li>
            ) : (
              appointments.map((a) => (
                <li
                  key={a.id}
                  className="grid grid-cols-5 gap-2 text-sm text-gray-700 border rounded-md p-2"
                >
                    <span>{a.provider_name}</span>
                    <span>{a.appointment_type}</span>
                    <span>{a.date}</span>
                    <span>{formatTimeAMPM(a.time)}</span>
                    <span>{a.clinic}</span>
                </li>
              ))
            )}
          </ul>
        </div>

        <div className="mt-10 border-t pt-6">
          
        </div>
      </div>
    </div>
  );
}