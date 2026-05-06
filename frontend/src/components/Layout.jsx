import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

// Layout component
// Sidebar
// Fixed header + ribbon
export default function Layout({ title = "App", children, onLogout }) {
    // states controlling sidebar
    const [sidebarOpen, setSidebarOpen] = useState(true);
    // user authentication token
    const { user } = useAuth();
    // constants that control that width of the sidebar
    const TOP = 56, OPEN = 220, CLOSED = 56;
    // modifies the apperance of links at header
    const linkBase = "px-3 py-1.5 rounded hover:bg-slate-100 text-sm";

    const activeClass = "text-indigo-600 font-semibold";
    // Links or routes established in App.jsx for sidebar and header
    // Depending on whether the role is patient, staff, or provider
    const links =
        user?.role === "patient"
            ? [
                { to: "/patient/hub", label: "Patient Hub" },
                { to: "/patient/page", label: "Patient" },
                { to: "/patient/book_appointment", label: "Book Appointment" },
                { to: "/patient/cancel", label: "Cancel Appointment" },
                { to: "/patient/provider_search", label: "Provider Search" },
                //{ to: "/patient/provider_information", label: "Provider Information" },
                { to: "/patient/clinic_search", label: "Clinic Search" },
                //{ to: "/patient/clinic_information", label: "Clinic Information" },
                { to: "/patient/profile", label: "Patient Profile" },
                { to: "/patient/visited_providers", label: "Visited Providers" },
                { to: "/patient/visited_clinics", label: "Visited Clinics" },
            ]
            : user?.role === "staff"
            ? [
                { to: "/staff/hub", label: "Staff Hub" },
                { to: "/staff/page", label: "Staff" },
                { to: "/staff/book_appointment", label: "Book Appointment" },
                { to: "/staff/cancel", label: "Cancel Appointment" },
                { to: "/staff/notify_patient", label: "Notify Patient" },
                { to: "/staff/profile", label: "Staff Profile" },
                { to: "/staff/patients", label: "Clinic's Patients" },
                { to: "/staff/complete-appointments", label: "Complete Appointment" },
                { to: "/staff/completed-appointments", label: "Completed Appointments"},
            ]
            : user?.role === "provider"
            ? [
                { to: "/provider/hub", label: "Provider Hub" },
                { to: "/provider/page", label: "Provider" },
                { to: "/provider/notify_staff", label: "Notify Staff" },
                { to: "/provider/profile", label: "Provider Profile" },
                { to: "/provider/clinics", label: "Provider's Clinics" },
                { to: "/provider/patients", label: "Provider's Patients" },
                { to: "/provider/completed-appointments", label: "Completed Appointments" },
            ]
            : [
                { to: "/login", label: "Login" },
            ];

    return (
    <div className="min-h-screen bg-slate-50 w-full">
        {/* Fixed header ribbon */}
        <header className="fixed top-0 left-0 right-0 h-14 z-50 bg-white border-b border-slate-200">
            {/* Header contents or links */}
            <div className="h-full w-full px-4 flex items-center justify-between">
                {/* Button in header for open/close sidebar */}
                <div className="flex items-center gap-3 min-w-0">
                    <button onClick={() => setSidebarOpen(v => !v)} className="px-3 py-1.5 rounded-md border border-slate-200 hover:bg-slate-100 shrink-0">☰</button>
                    <div className="font-semibold text-slate-800 truncate">{title}</div>
                </div>
                {/* Navigation links in header */}
                <div className="flex items-center gap-2">
                    <nav className="hidden md:flex items-center gap-2 flex-wrap justify-end">
                        {/* Changes apperance of link whenever link is clicked in header */}
                        {/* isActive = current link matches current location, if so, change the apperance of the link in the header */}
                        {/* Map the various links into the header */}
                        {links.map((link) => (
                            <NavLink
                                key={link.to}
                                to={link.to}
                                end={link.to === "/login"}
                                className={({isActive}) => `${linkBase} ${isActive ? activeClass : "text-slate-700"}`}
                            >
                                {link.label}
                            </NavLink>
                        ))}
                    </nav>
                    {/* Append the logout button at the end */}
                    {user && (
                        <button
                            onClick={onLogout}
                            className="px-3 py-1 rounded bg-slate-100 whitespace-nowrap"
                        >
                            Logout ({user.role})
                        </button>
                    )}
                </div>
            </div>
        </header>
        {/* side bar */}
        {/* change style of sidebar depending if sidebar is open or closed */}
        <aside
            className="fixed top-14 left-0 bottom-0 z-40 bg-white border-r border-slate-200 overflow-y-auto"
            style={{ width: sidebarOpen ? OPEN : CLOSED, transition: "width 200ms ease" }}
        >
            {/* sidebar links */}
            <nav className="p-3 text-sm">
                {sidebarOpen ? (
                <>
                    
                    {links.map((link) => (
                        <NavLink
                            key={link.to}
                            to={link.to}
                            end={link.to === "/login"}
                            className={({isActive}) => `block py-2 px-2 rounded ${isActive ? activeClass : "text-slate-700 hover:bg-slate-100"}`}
                        >
                            {link.label}
                        </NavLink>
                    ))}
                </>
                ) : <div className="p-2 text-center text-slate-400">•</div>}
            </nav>
        </aside>
        {/* Main content goes here */}
        {/* Main page inserted here, makes modular */}
        <main
            className="w-full"
            style={{
                paddingTop: TOP,
                marginLeft: sidebarOpen ? OPEN : CLOSED,
                transition: "margin-left 200ms ease",
                width: `calc(100% - ${sidebarOpen ? OPEN : CLOSED}px)`,
                minHeight: `calc(100vh - ${TOP}px)`,
            }}
            >
            {/* children refer to the pages for each role */}
            <div className="w-full px-6 py-6">
                {children}
            </div>
        </main>
    </div>
    );
}