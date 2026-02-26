import React from "react";
import { useNavigate } from "react-router-dom";

export default function ProviderHub({ buttons }) {
    const navigate = useNavigate();

    {/* Navigation buttons for hub */}
    const defaultButtons = [
    { id: "b1", label: "Provider Dashboard", to: "/provider" },
    { id: "b2", label: "Notify Staff", to: "/NotifyStaff" },
    ];

    const list = (buttons || defaultButtons).slice(0, 2);

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
            <div className="w-full max-w-4xl">
                {/* Title */}
                <h1 className="text-3xl font-bold text-slate-800 mb-6 text-center">Provider Hub</h1>
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