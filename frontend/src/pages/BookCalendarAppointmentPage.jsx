import React, { useState } from "react";

export default function BookCalendarAppointmentPage() {
  const [appointments, setAppointments] = useState([]);

  return (
    <div className="bg-gray-100 p-6">
      <div className="w-full bg-white border border-gray-300 rounded-xl shadow-sm p-6">
        {/* Title */}
        <h1 className="text-3xl font-bold text-indigo-600 text-center">
          Book Appointments
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
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/*
                    adds vertical spacing of 2 units between children 
                */}
                {/*
                    Input fields asking user to create an appointment
                    */}
                <div className="space-y-4">
                    <div>
                        {/*
                            block = label takes up a full line, input goes at the bottom
                            text-sm = small text
                            font-medium = medium weight
                            text-gray = gray text
                            */}
                        <label className="block text-sm font-medium text-gray-700">
                            Patient Name
                        </label>
                        {/*
                            mt-1 = margin at top of 1 unit
                            w-full = inputs fills full width
                            rounded-md = moderate rounded
                            border border-gray-300 = gray boder
                            p-2 = padding of 2 units inside
                            focus:outline-none = removes brower's outline focus
                            focus:ring-2 = adds a 2 px ring on focus
                            focus:ring-indigo-500 = ring has indigo color
                            */}
                        <input
                            type="text"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="John Doe"
                        />
                    </div>

                    <div>
                        {/*
                            block = label takes up a full line, input goes at the bottom
                            text-sm = small text
                            font-medium = medium weight
                            text-gray = gray text
                            */}
                        <label className="block text-sm font-medium text-gray-700">
                            Email
                        </label>
                        {/*
                            mt-1 = margin at top of 1 unit
                            w-full = inputs fills full width
                            rounded-md = moderate rounded
                            border border-gray-300 = gray boder
                            p-2 = padding of 2 units inside
                            focus:outline-none = removes brower's outline focus
                            focus:ring-2 = adds a 2 px ring on focus
                            focus:ring-indigo-500 = ring has indigo color
                            */}
                        <input
                            type="email"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="john@email.com"
                        />
                    </div>

                    <div>
                        {/*
                            block = label takes up a full line, input goes at the bottom
                            text-sm = small text
                            font-medium = medium weight
                            text-gray = gray text
                            */}
                        <label className="block text-sm font-medium text-gray-700">
                            Provider
                        </label>
                        {/*
                            mt-1 = margin at top of 1 unit
                            w-full = inputs fills full width
                            rounded-md = moderate rounded
                            border border-gray-300 = gray boder
                            p-2 = padding of 2 units inside
                            focus:outline-none = removes brower's outline focus
                            focus:ring-2 = adds a 2 px ring on focus
                            focus:ring-indigo-500 = ring has indigo color
                            */}
                        <input
                            type="text"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Dr. Smith"
                    />
                    </div>

                    <div>
                        {/*
                            block = label takes up a full line, input goes at the bottom
                            text-sm = small text
                            font-medium = medium weight
                            text-gray = gray text
                        */}
                        <label className="block text-sm font-medium text-gray-700">
                            Appointment Type
                        </label>
                        {/*
                            mt-1 = margin at top of 1 unit
                            w-full = inputs fills full width
                            rounded-md = moderate rounded
                            border border-gray-300 = gray boder
                            p-2 = padding of 2 units inside
                            focus:outline-none = removes brower's outline focus
                            focus:ring-2 = adds a 2 px ring on focus
                            focus:ring-indigo-500 = ring has indigo color
                            */}
                        <input
                            type="text"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Checkup"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        {/*
                            block = label takes up a full line, input goes at the bottom
                            text-sm = small text
                            font-medium = medium weight
                            text-gray = gray text
                        */}
                        <label className="block text-sm font-medium text-gray-700">
                            Date
                        </label>
                        {/*
                            mt-1 = margin at top of 1 unit
                            w-full = inputs fills full width
                            rounded-md = moderate rounded
                            border border-gray-300 = gray boder
                            p-2 = padding of 2 units inside
                            focus:outline-none = removes brower's outline focus
                            focus:ring-2 = adds a 2 px ring on focus
                            focus:ring-indigo-500 = ring has indigo color
                            */}
                        <input
                            type="date"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>

                    <div>
                        {/*
                            block = label takes up a full line, input goes at the bottom
                            text-sm = small text
                            font-medium = medium weight
                            text-gray = gray text
                        */}
                        <label className="block text-sm font-medium text-gray-700">
                            Time
                        </label>
                        {/*
                            mt-1 = margin at top of 1 unit
                            w-full = inputs fills full width
                            rounded-md = moderate rounded
                            border border-gray-300 = gray boder
                            p-2 = padding of 2 units inside
                            focus:outline-none = removes brower's outline focus
                            focus:ring-2 = adds a 2 px ring on focus
                            focus:ring-indigo-500 = ring has indigo color
                            */}
                        <input
                            type="time"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>
                {/*
                    Submit info for appointment
                    */}
                <div className="mt-6 flex justify-center sm:col-span-2">
                    <button
                    className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                    onClick={() => {}}
                    >
                    Submit Appointment
                    </button>
                </div>
            </div>          
        </div>
      </div>
    </div>
  );
}