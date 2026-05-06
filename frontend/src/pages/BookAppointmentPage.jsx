import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import { auth } from "../firebase";
import { Link } from "react-router-dom"
export default function BookAppointmentPage()
{
    // React Hooks
    // Sets up the date or state (appts)
    // setAppts is the function to update appts
    // useState is what creates a  piece of state, or the array
    const navigate = useNavigate();
    const { user } = useAuth();
    const [calendarAppts, setCalendarAppts] = useState([]);
    // Form that creates an appointment
    const [form, setForm] = useState({
        patientId: "",
        patientName: "",
        email: "",
        providerName: "",
        providerId: "",
        appointmentType: "",
        date: "",
        time: "",
        clinic: "",
        clinicId: ""
    });
    // Handles error in submission
    const [error, setError] = useState("");
    // Loading submission
    const [loading, setLoading] = useState(false);
    useEffect(() =>
    {
        async function loadCalendarAppointments()
        {
            try
            {
                // Get user authenticaiton
                if (!auth.currentUser || !user)
                    return;
                // Get authenticaiton token
                const token = await auth.currentUser.getIdToken();
                // Get today's date
                const now = new Date();
                // Determine start and end of month
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
                // Determine role
                const role = user.role === "staff" ? "staff" : "patient";
                // Fetch all appointments of month
                const res = await fetch(`/api/appointments/month?role=${role}&start=${monthStart}&end=${monthEnd}`, {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await res.json();
                // Check if response is ok, then set appointments data
                if (!res.ok)
                    throw new Error(data.error || "Failed to load calendar appointments");

                setCalendarAppts(data.appointments || []);
            }
            catch (err)
            {
                setError(err.message || "Failed to load calendar appointments");
            }
        }

        loadCalendarAppointments();
    }, [user]);
    async function handleSubmit() 
    {
        // Set error to none and well as loading to rue
        setError("");
        setLoading(true);
        // Try and catch to handle issues in revrieving token
        try 
        {
            // Retrieve authentication token
            const token = await auth.currentUser.getIdToken();
            // If token fetched, get a response by calling the api
            // book=appointment with the token details
            // backend will verify bearer token
            // json the form to be processed by backend
            const res = await fetch("/api/book-appointment", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            });
            // get data from response into JSON format
            const data = await res.json();
            // If response not ok, send error (failed to send appointment)
            if (!res.ok) 
                throw new Error(data.error || "Failed to book appointment");
            // After sent, redirec tto respective hubs
            if (user?.role === "patient") 
            {
                navigate("/patient/hub");
            } 
            else if (user?.role === "staff") 
            {
                navigate("/staff/hub");
            }
        } 
        catch (err) 
        {
            // Failed to fetch token or unable to submit sappointment, set error
            setError(err.message || "Unable to submit appointment");
        } 
        finally 
        {
            // Whether success or failutre, set loading to false
            setLoading(false);
        }
    }
    
    // Load the correct route depending on the role
    function handleDateClick(info) 
    {
        // If patient, redirect to book calendar patient
        if (user?.role === "patient") 
        {
            navigate("/patient/book_calendar", 
            {
                state: { selectedDate: info.dateStr }
            });
        } 
        // If staff, redirect to book calendar staff
        else if (user?.role === "staff")
        {
            navigate("/staff/book_calendar", 
            {
                state: { selectedDate: info.dateStr }
            });
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
                    Book Appointment
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
                                left: "prev,next today",
                                center: "title",
                                right: ""
                            }}
                            selectable={true}
                            editable={false}
                            dateClick={handleDateClick}
                            select={() => {}}
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
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {/*
                        border = setup border
                        border-gray = gray border
                        rounded-lg = large round borders
                        p-4 = interal paddding of 4
                     */}
                    <div className="border border-gray-200 rounded-lg p-4 sm:col-span-2">
                        <h2 className="text-lg font-semibold text-gray-900 text-center">
                            Book Appointment
                        </h2>
                        {/*
                            mt-6 = margin at top by 6 units
                            grid grid-cols-1 = grid of one column
                            gap-6 = gap between grid items
                         */}
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
                                        placeholder="First Name and Last Name" value={form.providerName} onChange={(e) => setForm({ ...form, providerName: e.target.value })}
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
                                        type="clinic"
                                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"  value={form.clinic} onChange={(e) => setForm({ ...form, clinic: e.target.value })}
                                    />
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
                                onClick={handleSubmit} disabled={loading}
                                >
                                    Submit Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}