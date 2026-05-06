import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { auth } from "../firebase"
export default function NotifyStaffPage()
{
    // React Hooks
    // Sets up the date or state (appts)
    // setAppts is the function to update appts
    // useState is what creates a  piece of state, or the array
    const navigate = useNavigate();
    const { user } = useAuth();

    // Upcoming appointments
    // Selected appointment to notify
    // Reason of excuse
    // Error handling
    // Loading
    const [appts, setAppts] = useState([]);
    const [selectedAppointmentId, setSelectedAppointmentId] = useState("");
    const [reason, setReason] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [calendarAppts, setCalendarAppts] = useState([]);
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
        // Load appointments for the day
        async function loadAppointments() 
        {
            try 
            {
                // Fetch token
                const token = await auth.currentUser.getIdToken();
                // Fetch response using token
                const res = await fetch("/api/get-provider-upcoming-appointments", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                // Convert response into token
                const data = await res.json();
                // If response not OK, send error
                if (!res.ok)
                    throw new Error(data.error || "Failed to load appointments");
                

                setAppts(data.appointments || []);


                // Calendar appointments for count and hours
                const now = new Date();
                // Determine start and end of month
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
                // Determine role
                const role = user.role;
                // Fetch all appointments of month
                const res2 = await fetch(`/api/appointments/month?role=${role}&start=${monthStart}&end=${monthEnd}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data2 = await res2.json();
                // Check if response is ok, then set appointments data
                if (!res2.ok)
                    throw new Error(data.error || "Failed to load calendar appointments");

                setCalendarAppts(data2.appointments || []);
            } 
            catch (err) 
            {
                setError(err.message || "Failed to load appointments");
            }
        }

        loadAppointments();
    }, []);
    // Handle submission of sending notification to staff
    async function handleSubmitReason() 
    {
        // Initialize error and loading
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
            // Convert response into JSON
            const data = await res.json();
            // if response not ok, send error
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
    // Number of appointments for a given day
    const appointmentCounts = calendarAppts.reduce((acc, appt) =>
    {
        const date = String(appt.date || "").trim();
        if (!date)
            return acc;

        acc[date] = (acc[date] || 0) + 1;
        return acc;
    }, {});
    // Get appointment hours
    const appointmentTimesByDate = calendarAppts.reduce((acc, appt) =>
    {  
        // Get appointment date + time into string
        const date = String(appt.date || "").trim();
        const time = String(appt.time || "").trim();

        if (!date || !time)
            return acc;
        // Check if  valid date
        if (!acc[date])
            acc[date] = [];

        acc[date].push(time);
        return acc;
    }, {});
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
    return (
        /*
            min-h-screen = makes container at least full height ov viewport
            bg=gray-100 = gray background
            flex = flexiable container
            items-center = vertically centers children
            justify-center = horizontally center children
            p-6 = padding on all sides by 6 units 
        */
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
            {/*
                w-full = take full width of parent
                max-w-3xl = maxiumum width
                bg-white = white background
                border = adds a border
                border-gray-300 = sets border go ray
                rounded-xl = extra large rounded border corners
                shadow-sm = small shadow around the card
                p-6 = padding inside the card by 6 units 
            */}
            <div className="w-full max-w-none bg-white border border-gray-300 rounded-xl shadow-sm p-6">
                {/*
                    text-4xl = big text size
                    font-bold = bold font
                    text-indigo-600 = indigo font color
                    text-center = center the text
                 */}
                 {/*
                    Heading of the page
                  */}
                <h1 className="text-4xl font-bold text-indigo-600 text-center">
                    Notify Staff
                </h1>
                {/*
                    mt-6 = add margin at top (outside) by 6 units
                    border = add border
                    border-gray-200 = gray border
                    rounded-lg = rounded large border
                    bg-white = white background
                    p-3 = internal padding by 3 units
                 */}
                 {/*
                    Interactive calendar using a calendar library
                  */}
                <div className="mt-6 border border-gray-200 rounded-lg bg-white p-3">
                    <FullCalendar
                        plugins={[dayGridPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        height="auto"
                        headerToolbar={{
                            left: "prev, next today",
                            center: "title",
                            right: ""
                        }}
                                        
                        selectable={true}   
                        editable={false}    
                        
                        dateClick={(info) => {
                            navigate("/provider/notify_staff_calendar", {
                                state: { selectedDate: info.dateStr }
                            });
                        }}
                        select={() => {

                        }}
                        dayCellClassNames={(arg) => {
                            // Get today's date of cell
                            const cellDate = new Date(arg.date);
                            const today = new Date();
                            // Determine start of week
                            const startOfWeek = new Date(today);
                            // Get date minus today
                            startOfWeek.setDate(today.getDate() - today.getDay());
                            // end of week is start of week + 6
                            const endOfWeek = new Date(startOfWeek);
                            endOfWeek.setDate(startOfWeek.getDate() + 6);
                            // check if it is today
                            const isToday = cellDate.toDateString() === today.toDateString();
                            // if current week, check if cell dates within range
                            const isCurrentWeek =
                            cellDate >= new Date(startOfWeek.setHours(0, 0, 0, 0)) &&
                            cellDate <= new Date(endOfWeek.setHours(23, 59, 59, 999));
                            // highlight current week and day
                            return [
                                isCurrentWeek ? "bg-blue-50" : "",
                                isToday ? "ring-2 ring-indigo-500 bg-yellow-100" : ""
                            ];
                        }}
                        dayCellContent={(arg) =>
                        {
                            // Get year, month, day
                            const year = arg.date.getFullYear();
                            const month = String(arg.date.getMonth() + 1).padStart(2, "0");
                            const day = String(arg.date.getDate()).padStart(2, "0");
                            // Create date out of year, month, day
                            const dateStr = arg.date.toISOString().slice(0, 10);
                            // Create appointment count per day and appoint hours per day
                            const count = appointmentCounts[dateStr] || 0;
                            const times = appointmentTimesByDate[dateStr] || [];

                            return (
                                // Replace with the number of appointments on a given date cell
                                <div className="flex h-full min-h-[90px] flex-col items-start overflow-hidden">
                                    <div className="flex w-full items-center justify-between">
                                        <span>{arg.dayNumberText.replace(/[^\d]/g, "")}</span>
                                        {count > 0 && (
                                            <span className="inline-block rounded-full bg-indigo-600 px-2 py-0.5 text-xs text-white">
                                                {count}
                                            </span>
                                        )}
                                    </div>
                                    {/* Dispaly also the appoint hours in a list */}
                                    {times.length > 0 && (
                                        <ul className="mt-1 max-h-16 w-full overflow-y-auto text-[10px] text-gray-700 space-y-1 pr-1">
                                            {times.map((time, idx) => (
                                                <li key={`${time}-${idx}`} className="truncate">
                                                    {formatTimeAMPM(time)}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        }}
                    />
                </div>
                {/*
                    mt-8 = top margin of 8 units
                    grid grid-cols-1 = a grid with one column
                    gap-6 = spacing between grid items
                 */}
                 {/*
                    Section below the calendar
                  */}
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-1 gap-6">
                    {/*
                        border = setup border
                        border-gray = gray border
                        rounded-lg = large round borders
                        p-4 = interal paddding of 4
                     */}
                    <div className="border border-gray-200 rounded-lg p-4">
                        <h2 className="text-lg font-semibold text-gray-900 text-center">
                            Cancel an Appointment from below or in the calendar
                        </h2>
                        <ul className="mt-4 space-y-2">
                            {/* Header row */}
                            <li className="grid grid-cols-7 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2">
                            <span>Provider</span>
                            <span>Type</span>
                            <span>Date</span>
                            <span>Time</span>
                            <span>Clinic</span>
                            <span>Patient Name</span>
                            <span>Action</span>
                            </li>
                            {/*
                                appts is an array, for appointments
                                check if length is 0
                                ? = ternary operator
                                if true, render first block the <li> </li>, no appointments
                                if false, then display appointments
                             */}
                            {appts.length === 0 ? (
                                <li className="text-sm text-gray-600 text-center">
                                    No appointments to cancel
                                </li>
                            ) : (
                                // appts.map, loop through the array and display each arrary item
                                // by id until all appointemnts displayed
                                appts.map((a) => (
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


                </div>
                {/*
                    A textbox where providers can write a reason why they cannot accomodate
                    a patient.
                    Reasons: Emergency or sick
                    Click on appointment and write a reasont to send to staff for processing
                 */}
                <div className="border border-gray-200 rounded-lg p-4">
                    <h2 className="text-lg font-semibold text-gray-900 text-center">
                        Reason to Excuse to Staff
                    </h2>
                    {/* Text area of reason and handler  */}
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
                    {/* Button that handles submission of reason for a given selected appointment id */}
                    <div className="mt-4 flex justify-center">
                        <button
                            className="px-5 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                            onClick={handleSubmitReason}
                            disabled={loading || !selectedAppointmentId || !reason.trim()}
                        >
                            {loading ? "Submitting..." : "Submit Reason"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}