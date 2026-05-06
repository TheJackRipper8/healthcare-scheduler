import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth } from "../firebase";
export default function NotificationStaffCalendarPage() {
  const location = useLocation();
  const selectedDate = location.state?.selectedDate || "";
  // provider notifications, selected appointment id to cancel, the reason
  // error handling, and loading of buttons
  const [notifications, setNotifications] = useState([]);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
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
    // Load appointments for the given day
    async function loadAppointments() 
    {
      
      try 
      {
        // If date invalid or token fail, return
        if (!selectedDate || !auth.currentUser) 
          return;
        // Get token
        const token = await auth.currentUser.getIdToken();
        // Get response using token
        const res = await fetch(`/api/appointments/by-date?date=${selectedDate}&scope=provider`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Convert response into json
        const data = await res.json();
        // If response not ok, send error
        if (!res.ok)
          throw new Error(data.error || "Failed to load appointments");

        setNotifications(data.appointments || []);
      } catch (err) {
        setError(err.message || "Failed to load appointments");
      }
    }

    loadAppointments();
  }, [selectedDate]);

  // Handles button in submitting provider excuses
  async function handleSubmitReason() 
  {
    // Initialize error andloading
    setError("");
    setLoading(true);

    try 
    {
      // Fetch token
      const token = await auth.currentUser.getIdToken();
      // Fetch response using token
      const res = await fetch("/api/notifications/staff", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          appointmentId: selectedAppointmentId,
          reason
        })
      });
      // Convert response into json
      const data = await res.json();
      // If response not ok, send error
      if (!res.ok)
        throw new Error(data.error || "Failed to send notification");
      

      setReason("");
      setSelectedAppointmentId("");
    } 
    catch (err) 
    {
      setError(err.message || "Unable to send notification");
    } 
    finally 
    {
      setLoading(false);
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Staff Notifications
        </h1>
        {/* Headers of appointments */}
        <div className="mt-6">
          <ul className="space-y-2">
          <li className="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2">
            <span>Provider</span>
            <span>Type</span>
            <span>Date</span>
            <span>Time</span>
            <span>Clinic</span>
            <span>Patient Name</span>
            <span>Action</span>
          </li>
            {/* Display appointments if any */}
            {notifications.length === 0 ? (
              <li className="text-sm text-gray-600 text-center">
                No appointments
              </li>
            ) : (
              notifications.map((a) => (
                // Map out appointments
                // Each appointment is clickable
                // Each clicked appointment has an id used for cancellation
                <li
                  key={a.id}
                  className="grid grid-cols-7 gap-2 text-sm text-gray-700 border rounded-md p-2 items-center"
                >
                  <span className="font-medium">{a.provider_name}</span>
                  <span>{a.appointment_type}</span>
                  <span>{a.date}</span>
                  <span>{formatTimeAMPM(a.time)}</span>
                  <span>{a.clinic}</span>
                  <span>{a.patient_name}</span>
                  <button
                    className="px-3 py-1 rounded-md bg-indigo-600 text-white text-xs hover:bg-indigo-700"
                    onClick={() => setSelectedAppointmentId(a.id)}
                  >
                    {selectedAppointmentId === a.id ? "Selected" : "Select"}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
        {/* Text box with button for staff to write reason of excuse */}    
        <div className="mt-10 border-t pt-6">
          <div className="border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 text-center">
              Reason to Excuse to Staff
              </h2>
            {/*  Text area for reason and function to ahndle reasoning */}
            <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">
                    Reason
                </label>
                <textarea
                  rows={4}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
            </div>
            {/* Butto to handle reason submission */}
            <div className="mt-4 flex justify-center">
              <button
                className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                onClick={{/*handleSubmitReason*/}}
                disabled={loading || !selectedAppointmentId || !reason.trim()}
              >
                {loading ? "Submitting..." : "Submit Reason"}
              </button>
            </div>
          </div>          
        </div>
      </div>
    </div>
  );
}