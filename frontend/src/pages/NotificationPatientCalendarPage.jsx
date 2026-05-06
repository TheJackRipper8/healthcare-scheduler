import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { auth } from "../firebase";

export default function NotificationPatientCalendarPage() {
  const location = useLocation();
  const selectedDate = location.state?.selectedDate || "";

  const [notifications, setNotifications] = useState([]);
  // Error handling and loading when subbmitting
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
    // Load appointments (notifications of a given day)
    async function loadNotifications() 
    {
      try 
      {
        // If selected data or current token failure, return
        if (!selectedDate || !auth.currentUser) 
          return;
        // Grab token
        const token = await auth.currentUser.getIdToken();
        // Ger response from firebase using token
        const res = await fetch(`/api/appointments/by-date?date=${selectedDate}&scope=staff-clinic`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Convert repsonse into json
        const data = await res.json();
        // Check if response is ok, if not, send error
        if (!res.ok)
          throw new Error(data.error || "Failed to load appointments");

        setNotifications(data.appointments || []);
      } catch (err) {
        setError(err.message || "Failed to load appointments");
      }
    }

    loadNotifications();
  }, [selectedDate]);
  // Handle notification of patient
  async function handleNotify(appointmentId, method) 
  {
    // Initialize loading and error
    setError("");
    setLoadingId(`${appointmentId}-${method}`);

    try 
    {
      // Grab token
      const token = await auth.currentUser.getIdToken();
      // Send response to firebase using token
      const res = await fetch("/api/notifications/patient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          appointmentId,
          method
        })
      });
      // Convet reponse into json
      const data = await res.json();
      // If response not ok, send error
      if (!res.ok)
        throw new Error(data.error || "Failed to send notification");
      
    } catch (err) {
      setError(err.message || "Unable to send notification");
    } finally {
      setLoadingId("");
    }
  }
  
  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Patient Notifications
        </h1>
        {/* Headers of appointments */}
        <div className="mt-6">
          <ul className="space-y-2">
            <li className="grid grid-cols-8 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2">
              <span>Provider</span>
              <span>Type</span>
              <span>Date</span>
              <span>Time</span>
              <span>Clinic</span>
              <span>Patient Name</span>
              <span>Email</span>
              <span>Text</span>
            </li>
            {/* Display appointments if any */}
            {notifications.length === 0 ? (
              <li className="text-sm text-gray-600 text-center">
                No notifications
              </li>
            ) : (
              notifications.map((a) => (
                // Map out each potential appointment to send notification
                <li
                    key={a.id}
                    className="grid grid-cols-8 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2"
                >
                    <span className="font-medium">{a.provider_name}</span>
                    <span>{a.appointment_type}</span>
                    <span>{a.date}</span>
                    <span>{formatTimeAMPM(a.time)}</span>
                    <span>{a.clinic}</span>
                    <span>{a.patient_name}</span>
                    <span>
                        {/*Button for email */}
                        <button
                            className="px-3 py-1 rounded-md bg-indigo-600 text-white text-xs hover:bg-indigo-700 disabled:opacity-60"
                            onClick={() => handleNotify(a.id, "email")}
                            disabled={loadingId === `${a.id}-email`}
                        >
                            {loadingId === `${a.id}-email` ? "Sending..." : "Email"}
                        </button>
                    </span>
                    <span>
                        {/*Button for text message */}
                        <button
                            className="px-3 py-1 rounded-md bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-60"
                            onClick={() => handleNotify(a.id, "text")}
                            disabled={loadingId === `${a.id}-text`}
                        >
                            {loadingId === `${a.id}-text` ? "Sending..." : "Text Message"}
                        </button>
                    </span>
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