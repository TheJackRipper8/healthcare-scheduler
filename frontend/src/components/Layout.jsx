import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";

// Layout component
// Sidebar
// Fixed header + ribbon
export default function Layout({ title = "App" }) {
    {/* UI states for side bar open and close */}
    const [sidebarOpen, setSidebarOpen] = useState(true);
    {/* constants for closing and opening side bar */}    
    const TOP = 56, OPEN = 220, CLOSED = 56;
    {/* Tailwind css helper strings */}
    const linkBase = "px-3 py-1.5 rounded hover:bg-slate-100 text-sm";
    const activeClass = "text-indigo-600 font-semibold";

    return (
    <div className="min-h-screen bg-slate-50">
        {/* Fixed header ribbon */}
        <header className="fixed top-0 left-0 right-0 h-14 z-50 bg-white border-b border-slate-200">
            {/* Header contents or links */}
            <div className="h-full w-full px-2 flex items-center justify-between">
                {/* Button in header for open/close sidebar */}
                <div className="flex items-center gap-3">
                    <button onClick={() => setSidebarOpen(v => !v)} className="px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-100">☰</button>
                    <div className="font-semibold text-slate-800">{title}</div>
                </div>
                {/* Navigation links in header */}
                <nav className="hidden md:flex items-center gap-2">
                    {/* Changes apperance of link whenever link is clicked in header */}
                    <NavLink to="/" end className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Patient</NavLink>
                    <NavLink to="/staff" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Staff</NavLink>
                    <NavLink to="/provider" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Provider</NavLink>
                    <NavLink to="/login" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Login</NavLink>
                    <NavLink to="/notify_patient" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Notify Patient</NavLink>
                    <NavLink to="/notify_staff" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Notify Staff</NavLink>
                    <NavLink to="/book_appointment" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Book Appointment</NavLink>
                    <NavLink to="/cancel_appointment" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Cancel Appointment</NavLink>

                    <NavLink to="/book_calendar" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Book Calendar Appointments</NavLink>
                    <NavLink to="/cancel_calendar" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Cancel Calendar Appointments</NavLink>
                    <NavLink to="/notify_staff_calendar" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Notify Staff Calendar</NavLink>
                    <NavLink to="/notify_patient_calendar" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Notify Patient Calendar</NavLink>
                    <NavLink to="/view_calendar" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>View Calendar Appointments</NavLink>
                    <NavLink to="/unauthorized" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Unauthorized</NavLink>

                    <NavLink to="/provider_hub" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Provider Hub</NavLink>
                    <NavLink to="/staff_hub" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Staff Hub</NavLink>
                    <NavLink to="/patient_hub" className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}>Patient Hub</NavLink>
                </nav>
            </div>
        </header>
        {/* side bar */}
        <aside className="fixed top-14 left-0 bottom-0 z-40 bg-white border-r border-slate-200"
                style={{ width: sidebarOpen ? OPEN : CLOSED, transition: "width 200ms ease" }}>
            {/* sidebar links */}
            <nav className="p-3 text-sm">
                {sidebarOpen ? (
                <>
                    <NavLink to="/" end className="block py-2">Patient</NavLink>
                    <NavLink to="/staff" className="block py-2">Staff</NavLink>
                    <NavLink to="/provider" className="block py-2">Provider</NavLink>
                    <NavLink to="/login" className="block py-2">Login</NavLink>
                    <NavLink to="/notify_patient" className="block py-2">Notify Patient</NavLink>
                    <NavLink to="/notify_staff" className="block py-2">Notify Staff</NavLink>
                    <NavLink to="/book_appointment" className="block py-2">Book Appointment</NavLink>
                    <NavLink to="/cancel_appointment" className="block py-2">Cancel Appointment</NavLink>

                    <NavLink to="/book_calendar" className="block py-2">Book Calendar Appointments</NavLink>
                    <NavLink to="/cancel_calendar" className="block py-2">Cancel Calendar Appointments</NavLink>
                    <NavLink to="/notify_staff_calendar" className="block py-2">Notify Staff Calendar</NavLink>
                    <NavLink to="/notify_patient_calendar" className="block py-2">Notify Patient Calendar</NavLink>
                    <NavLink to="/view_calendar" className="block py-2">View Calendar Appointments</NavLink>
                    <NavLink to="/unauthorized" className="block py-2">Unauthorized</NavLink>

                    <NavLink to="/provider_hub" className="block py-2">Provider Hub</NavLink>
                    <NavLink to="/staff_hub" className="block py-2">Staff Hub</NavLink>
                    <NavLink to="/patient_hub" className="block py-2">Patient Hub</NavLink>
                </>
                ) : <div className="p-2 text-center text-slate-400">•</div>}
            </nav>
        </aside>
        {/* Main content goes here */}
        <main style={{ paddingTop: TOP, marginLeft: sidebarOpen ? OPEN : CLOSED, transition: "margin-left 200ms ease" }}>
            <div className="p-6 max-w-7xl mx-auto">
                <Outlet />
            </div>
        </main>
    </div>
    );
}