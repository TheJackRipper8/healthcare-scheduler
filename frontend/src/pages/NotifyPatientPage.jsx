import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";


export default function NotifyPatientPage()
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
                    Notify Patient
                </h1>
                {/*
                    Interactive buttons used to implement respective page's functionality
                    mt-6 = margin at top with 6 units
                    flex = flexiable container
                    items-center = align all items center vertically
                    justify-between = evenly space out items
                    px-4 = horizontal padding on left and right by 4 units
                    py-4 = vertical padding top and bottom by 2 units
                    rounded-lg = rounded corners
                    bg-blue = blue background
                    text-white = white text
                    font-medium = medium font weight
                    hover:bg-blue-700 = hover color, background turns blue
                    transition = smooth transitions when hovering
                 */}
                <div className="mt-6 flex items-center justify-between">
                    <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition"
                            onClick={() => {}}
                    >
                        Book Appointment
                    </button>
                    <button className="px-4 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-red-700 transition"
                            onClick={() => {}}
                    >
                        Cancel Appointment
                    </button>
                </div>
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
                            Upcoming Appointments
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
                                    No appointments
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
                                        <div className="flex justify-end gap-2">
                                            <button
                                                className="px-3 py-1 rounded-md bg-indigo-600 text-white text-xs hover:bg-indigo-700"
                                                onClick={() => {}}
                                            >
                                                Email
                                            </button>
                                            <button
                                                className="px-3 py-1 rounded-md bg-red-600 text-white text-xs hover:bg-red-700"
                                                onClick={() => {}}
                                            >
                                                Text Message
                                            </button>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}