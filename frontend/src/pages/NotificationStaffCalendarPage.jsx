import React, { useState } from "react";

export default function NotificationStaffCalendarPage() {
  const [notifications, setNotifications] = useState([]);

  return (
    <div className="bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Staff Notifications
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
            {notifications.length === 0 ? (
              <li className="text-sm text-gray-600 text-center">
                No notifications
              </li>
            ) : (
              notifications.map((a) => (
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
          <div className="border border-gray-200 rounded-lg p-4">
            <h2 className="text-lg font-semibold text-gray-900 text-center">
            Reason to Excuse to Staff
            </h2>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">
                Reason
            </label>
            <textarea
                rows={4}
                className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="mt-4 flex justify-center">
            <button
            className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
            onClick={() => {

            }}
            >
                Submit Reason
            </button>
          </div>
          </div>          
        </div>
      </div>
    </div>
  );
}