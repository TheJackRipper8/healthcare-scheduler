import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { auth } from "../firebase";
import { useAuth } from "../auth/AuthContext";
export default function BookCalendarAppointmentPage() {
    const { user } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const selectedDate = location.state?.selectedDate || "";

    const [appointments, setAppointments] = useState([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState({
        patientName: "",
        email: "",
        providerName: "",
        providerId: "",
        appointmentType: "",
        date: selectedDate,
        time: "",
        clinic: "",
        clinicId: ""
    });
    
    // Executed when apge is rendered
    useEffect(() => {
        // Load appointments for a given day
        async function loadAppointments() 
        {
            try 
            {
                // If date not invalid or authentication failutre, quit
                if (!selectedDate || !auth.currentUser) 
                    return;
                // Grab authentication token
                const token = await auth.currentUser.getIdToken();
                // Fetch response using th eapi endpoint by sending the bearer token
                console.log(selectedDate);
                let scope = "patient";
                if (user.role == "staff")
                    scope = "staff-clinic";
                const res = await fetch(`/api/get-book-calendar-appointment-page?date=${selectedDate}&scope=${scope}`, {
                    method: "GET",
                    headers: {
                    Authorization: `Bearer ${token}`
                    }
                });
                // Convert data into JSON 
                const data = await res.json();
                // If response not ok, send error
                if (!res.ok)
                    throw new Error(data.error || "Failed to load appointments");
                
                // Otherwise, set appointments
                setAppointments(data.appointments || []);
            } 
            catch (err) 
            {
                setError(err.message || "Failed to load appointments");
            }
        }

    loadAppointments();
    }, [selectedDate]);
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
    async function handleSubmit() 
    {
        // Set error as none and loading to true
        setError("");
        setLoading(true);
        // Try-catch 
        try 
        {
            //Fetch authentication token
            const token = await auth.currentUser.getIdToken();
            // Fetch response using endpoint with token
            const res = await fetch("/api/book-calendar-appointment-page", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            // Convert data into JSON
            const data = await res.json();
            // If response not ok, send error
            if (!res.ok)
                throw new Error(data.error || "Failed to book appointment");
            
            // Redirect to hub based on role
            if (user?.role === "patient")
                navigate("/patient/hub");
            else if (user?.role === "staff")
                navigate("/staff/hub");
            
        } 
        catch (err) 
        {
            // Set error
            setError(err.message || "Unable to submit appointment");
        } 
        finally 
        {
            // Loading to false
            setLoading(false);
        }
    }
    
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
                  <span>{formatTimeAMPM(a.time)}</span>
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
                            placeholder="First Name and Last Name" value={form.patientName} onChange={(e) => setForm({ ...form, patientName: e.target.value })}
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
                            placeholder="patient@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                            placeholder="First Name and Last Name"value={form.providerName} onChange={(e) => setForm({ ...form, providerName: e.target.value })}
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
                            placeholder="Checkup"value={form.appointmentType} onChange={(e) => setForm({ ...form, appointmentType: e.target.value })}
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
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
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
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })}
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
                            Clinic
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
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500" value={form.clinic} onChange={(e) => setForm({ ...form, clinic: e.target.value })}
                        />
                        {/* Used for rescheduling, asking for patient id */}
                    </div>
                    {user?.role === "staff" && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700">
                            Patient ID
                        </label>
                        <input
                            type="text"
                            className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder="Enter patient ID"
                            value={form.patientId}
                            onChange={(e) => setForm({ ...form, patientId: e.target.value })}
                        />
                    </div>
                    )}
                </div>
                {/*
                    Submit info for appointment
                    */}
                <div className="mt-6 flex justify-center sm:col-span-2">
                    <button
                    className="px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition"
                    onClick={handleSubmit}
                    >
                    {/* */}
                    {loading ? "Submitting..." : "Submit Appointment"}
                    </button>
                </div>
            </div>          
        </div>
      </div>
    </div>
  );
}