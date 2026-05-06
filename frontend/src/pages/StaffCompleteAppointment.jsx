import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../auth/AuthContext";
export default function StaffCompleteAppointmentPage() {
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
    console.log("useEffect ran", selectedDate, user);
    async function loadToday() 
    {
      try 
      {
        // If authentication token fail or selected date invalid send error
        if (!auth.currentUser || !selectedDate || !user)
          return;
        // If retrieve token
        const token = await auth.currentUser.getIdToken();
        // Get response from firebase using token
        let scope = "staff-clinic";

        const res = await fetch(`/api/get-staff-complete-appointment?scope=${scope}`, {//fetch(`/api/get-staff-complete-appointment?date=${selectedDate}&scope=${scope}`, {
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
  }, [selectedDate, user]);

  // Cancel an appointment
  async function handleComplete(appointmentId) 
  {
    // Set error to empty string and loading ID to appointment IOD
    setError("");
    setLoadingId(appointmentId);

    try 
    {
      console.log("test");
      // Fetch authentication token
      const token = await auth.currentUser.getIdToken();
      // Fetch response from firebase using token
      const res = await fetch("/api/staff-complete-appointment-page", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ appointmentId })
      });
      // Convert response into JSOn
      const data = await res.json();
      // If response not ok, send error
      if (!res.ok)
        throw new Error(data.error || "Failed to complete appointment");
      

      setAppointments((prev) => prev.filter((a) => a.id !== appointmentId));
      // Navigate to hub based on role
      if (user?.role === "patient")
        navigate("/patient/hub");
      else if (user?.role === "staff")
        navigate("/staff/hub");
    } 
    catch (err) 
    {
      setError(err.message || "Unable to complete appointment");
    } 
    finally 
    {
      setLoadingId("");
    }
  }  

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Complete Appointments
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
            {appointments.length === 0 ? (
              <li className="text-sm text-gray-600 text-center">
                No appointments
              </li>
            ) : (
              appointments.map((a) => (
              <li
                key={a.id}
                className="grid grid-cols-7 gap-2 text-sm text-gray-700 border rounded-md p-2"
              >
                  <span>{a.provider_name}</span>
                  <span>{a.appointment_type}</span>
                  <span>{a.date}</span>
                  <span>{formatTimeAMPM(a.time)}</span>
                  <span>{a.clinic}</span>
                  <span>{a.patient_name}</span>
                  <span>
                      <button
                          className="px-3 py-1 rounded-md bg-red-600 text-white text-xs hover:bg-red-700 disabled:opacity-60"
                          onClick={() => handleComplete(a.id)}
                          disabled={loadingId === a.id}
                      >
                        {/*  */}
                          {loadingId === a.id ? "Completing..." : "Complete"}
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