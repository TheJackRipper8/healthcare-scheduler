// Import Express framework for node.js
import express from "express";
// CORS helps frontend interact with backend
import cors from "cors";
// Loads .env variables into process.env like PORT, SQLITE_PATH, SESSION_SECRET
import dotenv from "dotenv";
// route handler functions
import handlers from "./handlers.js";
// session support for express backend
//import session from "express-session";

// reads .env file, places variables into process.env
dotenv.config();
// create experss server app
const app = express();
// allows frontend to interact with backend
app.use(cors());
// allows reading of JSON bodies (requests)
app.use(express.json());


// Express uses these endpoints. When someone uses the endpoint, run
// respective handler

// Authentication

// This is a function that helps with async Express route handlers
// fn is the functiion
// The function returns a new function with req, res, and next
// Promise refers to ensure a value is always returned
function asyncHandler(fn) {
  return (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
}

// Route (function) using asyncHandler
app.get("/api/me", asyncHandler(handlers.me));

// This enables Ex press to resolve errors in handlers
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({
    ok: false,
    error: err.message || "Server error",
  });
});


// Initiliaze port and listen to requests
const PORT = process.env.PORT || 5713;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

// Book Appointment Page
app.post("/api/book-appointment", asyncHandler(handlers.bookAppointment));

// BookCalendarAppointmentPage
app.get("/api/get-book-calendar-appointment-page", asyncHandler(handlers.getBookCalendarAppointmentPage));
app.post("/api/book-calendar-appointment-page", asyncHandler(handlers.bookAppointment));

// CancelAppointmentPage
app.post("/api/cancel-appointment-page", asyncHandler(handlers.cancelAppointment));
app.get("/api/get-cancel-appointment-page", asyncHandler(handlers.getCancelAppointments));
// CancelCalendarAppointmentPage, 
app.post("/api/cancel-calendar-appointment-page", asyncHandler(handlers.cancelAppointment));
app.get("/api/get-cancel-calendar-appointment-page", asyncHandler(handlers.getCancelCalendarAppointments));
// ClinicInformationPage
app.get("/api/clinic/info", asyncHandler(handlers.getClinicInformation));
// ClinicSearchPage
app.post("/api/clinic/search", asyncHandler(handlers.searchClinics));
// ViewAppointmentPage && NotificationPatientCalendarPage && NotificationStaffCalendarPage
app.get("/api/appointments/by-date", asyncHandler(handlers.getAppointmentsByDate)); 
// StaffProfilePage
app.get("/api/staff/profile-basic", asyncHandler(handlers.getStaffProfileBasic));
// PatientProfilePage
app.get("/api/patient/profile", asyncHandler(handlers.displayPatientInformation));
app.post("/api/patient/profile/preferences", asyncHandler(handlers.updatePatientPreferences));
// ProviderProfilePage
app.get("/api/provider/profile-basic", asyncHandler(handlers.getProviderProfileBasic));
// ProviderSearchPage
app.get("/api/providers/search", asyncHandler(handlers.searchProviders));
// ProviderInformationPage
app.get("/api/provider/info", asyncHandler(handlers.getProviderInformation));

// StaffPage & ProviderPage 
app.get("/api/appointments/daily", asyncHandler(handlers.getDailyAppointments));
app.get("/api/appointments/weekly", asyncHandler(handlers.getWeeklyAppointments));

// StaffPage & PatientPage
app.get("/api/notifications", asyncHandler(handlers.getNotifications));

// PatientPage && NotifyPatientPage && NotifyStaffPage
app.get("/api/appointments/upcoming", asyncHandler(handlers.getUpcomingAppointments));
app.get("/api/appointments/past", asyncHandler(handlers.getPastAppointments));

// NotifyPatientPage && NotificationPatientCalendarPage
app.post("/api/notifications/patient", asyncHandler(handlers.sendPatientNotification));
app.get("/api/get-staff-upcoming-appointments", asyncHandler(handlers.getStaffUpcomingAppointments));

// NotifyStaffPage && NotificationStaffCalendarPage
app.post("/api/notifications/staff", asyncHandler(handlers.sendStaffNotification));
app.get("/api/get-provider-upcoming-appointments", asyncHandler(handlers.getUpcomingProviderAppointments));

// ProviderClinicDatabase
app.get("/api/provider/clinics", asyncHandler(handlers.getProviderClinics));

// ProviderPatientDatabase
app.get("/api/provider/patients", asyncHandler(handlers.getProviderPatients));

// StaffPatientDatabase
app.get("/api/staff/patients", asyncHandler(handlers.getStaffPatients));

// StaffCompleteAppointmentPage
app.get("/api/get-staff-complete-appointment", asyncHandler(handlers.getClinicAppointments))
app.post("/api/staff-complete-appointment-page", asyncHandler(handlers.setAppointmentAsComplete))

// ProviderCompleteAppointmentPage
app.get("/api/get-provider-complete-appointment", asyncHandler(handlers.getProviderCompletedAppointments));

// PatientVisitedProviders
app.get("/api/patient/visited-providers", asyncHandler(handlers.getPatientVisitedProviders));

// PatientVisitedClinics
app.get("/api/patient/visited-clinics", asyncHandler(handlers.getPatientVisitedClinics));

// StaffCompletedAppointments
app.get("/api/get-staff-completed-appointment", asyncHandler(handlers.getStaffCompletedAppointments));

// StaffPage, ProviderPage, PatientPage
app.get("/api/appointments/month", asyncHandler(handlers.getMonthlyAppointments));