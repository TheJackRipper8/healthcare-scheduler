// Import React to use its components
import React from "react";
// BrowserRouter = enabgles client-side routing, allows app changes without app reload
// Routes = container for Route
// Route = defines URL path to a component (module)
// Link = like <a> in HTML, for React
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PatientPage from "./pages/PatientPage";
import ProviderPage from "./pages/ProviderPage";
import StaffPage from "./pages/StaffPage";
import NotifyStaffPage from "./pages/NotifyStaffPage";
import NotifyPatientPage from "./pages/NotifyPatientPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import CancelAppointmentPage from "./pages/CancelAppointmentPage";
import LoginPage from "./pages/LoginPage";

export default function App() {
  return (
    <BrowserRouter>
      <header className="bg-white shadow-sm">
        {/*
          <nav> = navigation bar
          Navigation bar needs links
          <Link> provides links for userse to click on and redirect to respective page
         */}
        <nav className="max-w-7xl mx-auto px-4 py-3 flex gap-4">
          <Link to="/" className="text-indigo-600 font-medium">Patient</Link>
          <Link to="/provider" className="text-slate-700">Provider</Link>
          <Link to="/staff" className="text-slate-700">Staff</Link>
          <Link to="/notify_staff" className="text-slate-700">Notify Staff</Link>
          <Link to="/notify_patient" className="text-slate-700">Notify Patient</Link>
          <Link to="/book_appointment" className="text-slate-700">Book Appointment</Link>
          <Link to="/cancel_appointment" className="text-slate-700">Cancel Appointment</Link>
          <Link to="/login" className="text-slate-700">Login</Link>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/*
          after link is established in <nav> with <Link>
          it is necessary to point the link to the actual page to be rendered
          <Route> connects the link to the actual webpage
         */}
        <Routes>
          <Route path="/" element={<PatientPage />} />
          <Route path="/provider" element={<ProviderPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/notify_staff" element={<NotifyStaffPage/>}/>
          <Route path="/notify_Patient" element={<NotifyPatientPage/>}/>
          <Route path="/book_appointment" element={<BookAppointmentPage />} />
          <Route path="/cancel_appointment" element={<CancelAppointmentPage/>}/>
          <Route path="/login" element={<LoginPage/>}/>
        </Routes>
      </main>
    </BrowserRouter>
  );
}
