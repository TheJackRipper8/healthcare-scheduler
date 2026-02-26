import React, { useState } from "react";

export default function ViewCalendarAppointmentPage() {
  const [appointments, setAppointments] = useState([]);

  return (
    <div className="bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          View Appointments
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
                  <span>{a.time}</span>
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