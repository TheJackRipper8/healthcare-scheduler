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
import BookCalendarAppointmentPage from "./pages/BookCalendarAppointmentPage";
import CancelCalendarAppointmentPage from "./pages/CancelCalendarAppointmentPage";
import ViewCalendarAppointmentPage from "./pages/ViewCalendarAppointmentPage";
import NotificationPatientCalendarPage from "./pages/NotificationPatientCalendarPage";
import NotificationStaffCalendarPage from "./pages/NotificationStaffCalendarPage";
import UnauthorizedPage from "./pages/Unauthorized";
import PatientHub from "./pages/PatientHub";
import StaffHub from "./pages/StaffHub";
import ProviderHub from "./pages/ProviderHub";
// Layout that has fixed header/ribbon + sidebar
import Layout from "./components/Layout";

export default function App() {
  return (
    <BrowserRouter>
        {/*
          after link is established in <nav> with <Link>
          it is necessary to point the link to the actual page to be rendered
          <Route> connects the link to the actual webpage
          */}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<PatientPage />} />
          <Route path="/provider" element={<ProviderPage />} />
          <Route path="/staff" element={<StaffPage />} />
          <Route path="/notify_staff" element={<NotifyStaffPage/>}/>
          <Route path="/notify_patient" element={<NotifyPatientPage/>}/>
          <Route path="/book_appointment" element={<BookAppointmentPage />} />
          <Route path="/cancel_appointment" element={<CancelAppointmentPage/>}/>

          <Route path="/cancel_calendar" element={<CancelCalendarAppointmentPage/>}/>
          <Route path="/book_calendar" element={<BookCalendarAppointmentPage/>}/>
          <Route path="/view_calendar" element={<ViewCalendarAppointmentPage/>}/>
          <Route path="/notify_staff_calendar" element={<NotificationStaffCalendarPage/>}/>
          <Route path="/notify_patient_calendar" element={<NotificationPatientCalendarPage/>}/>

          <Route path="/provider_hub" element={<ProviderHub/>}/>
          <Route path="/staff_hub" element={<StaffHub/>}/>
          <Route path="/patient_hub" element={<PatientHub/>}/>
        </Route>
        <Route path="/unauthorized" element={<UnauthorizedPage/>}/>
        <Route path="/login" element={<LoginPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}
