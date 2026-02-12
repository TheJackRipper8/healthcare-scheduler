import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";


export default function PatientPage()
{
    // React Hooks
    // Sets up the date or state (appts)
    // setAppts is the function to update appts
    // useState is what creates a  piece of state, or the array
    const [appts, setAppts] = useState([]);
    const [pastAppts, setPastAppts] = useState([]);
    // userEffect is the code that runs after a component renders
    useEffect(()=> {
        setAppts([]);
        setPastAppts([]);
    }, []);
    return (
        /*
            min-h-screen = makes container at least full height ov viewport
            bg=gray-100 = gray background
            flex = flexiable container
            items-center = vertically centers children
            justify-center = horizontally center children
            p-6 = padding on all sides by 6 units 
        */
        <div className="min-h screen bg-gray-100 flex items-center justify-center p-6">
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
            <div className="w-full max-w-3xl bg-white border border-gray-300 rounded-xl shadow-sm p-6">
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
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        height="auto"
                        headerToolbar={{
                            left: "prev, next today",
                            center: "title",
                            right: ""
                        }}
                                        
                        selectable={true}   
                        editable={false}    
                        
                        dateClick={() => {

                        }}
                        select={() => {

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
                            <li className="grid grid-cols-5 gap-2 text-xs font-semibold text-gray-500 uppercase border-b pb-2">
                                <span>Provider</span>
                                <span>Type</span>
                                <span>Date</span>
                                <span>Time</span>
                                <span>Clinic</span>
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
                                        className="text-sm text-gray-700 border rounded-md p-2"
                                    >
                                        <span className="font-medium">{a.provider_name}</span>
                                        <span>{a.appointment_type}</span>
                                        <span>{a.date}</span>
                                        <span>{a.time}</span>
                                        <span>{a.clinic}</span>
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
    )
}