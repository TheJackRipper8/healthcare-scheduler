import React from "react";
import { useNavigate } from "react-router-dom";

export default function PatientHub({ buttons }) {
    const navigate = useNavigate();

    {/* Navigation buttons for hub */}
    const defaultButtons = [
        { id: "b1", label: "Patient Dashboard", to: "/patient/page" },
        { id: "b2", label: "Cancel Appointment", to: "/patient/cancel" },
        { id: "b3", label: "Book Appointment", to: "/patient/book_appointment" },
        { id: "b4", label: "Provider Search", to: "/patient/provider_search" },
        { id: "b5", label: "Clinic Search", to: "/patient/clinic_search" },
        { id: "b6", label: "Patient Profile", to: "/patient/profile" },
        { id: "b7", label: "Visited Providers", to: "/patient/visited_providers" },
        { id: "b8", label: "Visited Clinics", to: "/patient/visited_clinics" },        
        
    ];

    const list = (buttons || defaultButtons)

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl">
                {/* Title */}
                <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Patient Hub</h1>
                {/* Grid to display buttons */}
                <div className="grid grid-cols-2 gap-6">
                    {list.map((b) => (
                    <button
                        key={b.id}
                        onClick={() => {
                        if (b.to) navigate(b.to);
                        else if (typeof b.onClick === "function") b.onClick();
                        }}
                        className="aspect-square w-full rounded-xl bg-white border border-slate-200 shadow-sm hover:shadow-lg transition flex flex-col items-center justify-center p-4 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label={b.label}
                    >
                        <div className="w-12 h-12 mb-3 text-indigo-600" aria-hidden>
                            {/* Icon */}
                            <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                                <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
                            </svg>
                        </div>
                        {/* Button Label*/}
                        <span className="text-lg font-medium text-slate-700">{b.label}</span>
                    </button>
                    ))}
                </div>

                <div className="mt-8 text-center text-sm text-slate-500">
                    
                </div>
            </div>
        </div>
    );
}