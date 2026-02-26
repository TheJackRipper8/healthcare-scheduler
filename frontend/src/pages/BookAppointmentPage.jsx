import React, { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { Link } from "react-router-dom"

export default function BookAppointmentPage()
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
        </div>
    )
}