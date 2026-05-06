import React from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useAuth } from "./auth/AuthContext";
// Imports
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
import PatientProfilePage from "./pages/PatientProfilePage";
import ProviderProfilePage from "./pages/ProviderProfilePage";
import StaffProfilePage from "./pages/StaffProfilePage";
import ClinicInformationPage from "./pages/ClinicInformationPage";
import ClinicSearchPage from "./pages/ClinicSearchPage";
import ProviderSearchPage from "./pages/ProviderSearchPage";
import ProviderInformationPage from "./pages/ProviderInformationPage";
import Layout from "./components/Layout";
import StaffPatientDatabase from "./pages/StaffPatientDatabase";
import ProviderClinicDatabase from "./pages/ProviderClinicDatabase";
import ProviderPatientDatabase from "./pages/ProviderPatientDatabase";
import StaffCompleteAppointmentPage from "./pages/StaffCompleteAppointment";
import PatientVisitedProvider from "./pages/PatientVisitedProviders";
import PatientVisitedClinics from "./pages/PatientVisitedClinics";
import ProviderCompleteAppointmentPage from "./pages/ProviderCompleteAppointment";
import StaffCompletedAppointmentsPage from "./pages/StaffCompletedAppointments";

// Function responsible for ensuring the pages are protected and only accessible by allowed roles
function ProtectedRoute({ allowedRoles, children }) 
{
  // Get the current logged in user from AuthContext through helper function
  const { user } = useAuth();
  // If not user, navigate to login
  if (!user)
      return <Navigate to="/login" replace />;
  // If not valid role, redirect to unauhtorized
  if (!allowedRoles.includes(user.role)) 
    return <Navigate to="/unauthorized" replace />;
  // Other wise return the children (pages of the role)
  // children components
  return children;
}

// When user logs in, redirect them to the current hub page
function RoleHomeRedirect() 
{
  // Get current authenticated user information from AuthContext through helper
  const { user } = useAuth();
  // If user not logged in, navigate to LoginPage
  if (!user) 
    return <Navigate to="/login" replace />;
  // If user is patient, redirect to patient hub
  if (user.role === "patient") 
    return <Navigate to="/patient/hub" replace />;
  // If user is staff, redirect them to staff
  if (user.role === "staff") 
    return <Navigate to="/staff/hub" replace />;
  // If user is provider, redirect them to provider hub
  if (user.role === "provider") 
    return <Navigate to="/provider/hub" replace />;
  // Otherwise, show unauthroized page
  return <Navigate to="/unauthorized" replace />;
}

// Start of App component, main React component for application
export default function App() 
{
  // Get authenticaiton data from firebase from AuthContext
  const { user, setUser } = useAuth();
  // Logout function
  async function handleLogout() {
    // Perform logout
    try 
    {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
    } 
    // Incase logout fails
    catch (err) 
    {
      console.error("Logout error:", err);
    } 
    // Otherwise clear session data of the user
    finally 
    {
      setUser(null);
    }
  }

  return (
    // {/* BrowserRouter enables routing in React*/}
    <BrowserRouter>
      {/* Main class for routes and full width*/}
      <main className="w-full">
        {/* Routes of React */}
        <Routes>
          {/* When first visiting application, redirect to the hub or login page*/}
          <Route path="/" element={<RoleHomeRedirect />} />
          {/* if login page, display it */}
          <Route path="/login" element={<LoginPage />} />
          {/* if failed to login, show warning*/}
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected routes for patient*/}
          {/* layout to enforce layout component on all pages */}
          {/* pass handleLogout function to assist logging out after signing in*/}
          <Route path="/patient" element={<Navigate to="/patient/hub" replace />} />
          <Route
            path="/patient/hub"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Layout title="Patient" onLogout={handleLogout}>
                  <PatientHub />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/page"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Layout title="Patient" onLogout={handleLogout}>
                  <PatientPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/profile"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Layout title="Patient" onLogout={handleLogout}>
                  <PatientProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/book_appointment"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Layout title="Patient" onLogout={handleLogout}>
                  <BookAppointmentPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/book_calendar"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <BookCalendarAppointmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/cancel"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Layout title="Patient" onLogout={handleLogout}>
                  <CancelAppointmentPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/cancel_calendar"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <CancelCalendarAppointmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/clinic_search"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Layout title="Patient" onLogout={handleLogout}>
                  <ClinicSearchPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/clinic_information"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Layout title="Patient" onLogout={handleLogout}>
                  <ClinicInformationPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/provider_search"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Layout title="Patient" onLogout={handleLogout}>
                  <ProviderSearchPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/provider_information"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Layout title="Patient" onLogout={handleLogout}>
                  <ProviderInformationPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/view_calendar"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <ViewCalendarAppointmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patient/visited_providers"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Layout title="Patient" onLogout={handleLogout}>
                  <PatientVisitedProvider/>
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/patient/visited_clinics"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <Layout title="Patient" onLogout={handleLogout}>
                  <PatientVisitedClinics />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Protected routes for staff */}
          {/* layout to enforce layout component on all pages */}
          {/* pass handleLogout function to assist logging out after signing in*/}
          <Route path="/staff" element={<Navigate to="/staff/hub" replace />} />
          <Route
            path="/staff/hub"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <Layout title="Staff" onLogout={handleLogout}>
                  <StaffHub />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/page"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <Layout title="Staff" onLogout={handleLogout}>
                  <StaffPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/profile"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <Layout title="Staff" onLogout={handleLogout}>
                  <StaffProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/book_appointment"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <Layout title="Staff" onLogout={handleLogout}>
                  <BookAppointmentPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/book_calendar"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <BookCalendarAppointmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/cancel"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <Layout title="Staff" onLogout={handleLogout}>
                  <CancelAppointmentPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/cancel_calendar"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <CancelCalendarAppointmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/notify_patient"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <Layout title="Staff" onLogout={handleLogout}>
                  <NotifyPatientPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/notify_patient_calendar"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <NotificationPatientCalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/view_calendar"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <ViewCalendarAppointmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/patients"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <Layout title="Staff" onLogout={handleLogout}>
                  <StaffPatientDatabase />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/complete-appointments"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <Layout title="Staff" onLogout={handleLogout}>
                  <StaffCompleteAppointmentPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/staff/completed-appointments"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <Layout title="Staff" onLogout={handleLogout}>
                  <StaffCompletedAppointmentsPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          {/* Protected routes for provider*/}
          {/* layout to enforce layout component on all pages */}
          {/* pass handleLogout function to assist logging out after signing in*/}
          <Route path="/provider" element={<Navigate to="/provider/hub" replace />} />
          <Route
            path="/provider/hub"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <Layout title="Provider" onLogout={handleLogout}>
                  <ProviderHub />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/page"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <Layout title="Provider" onLogout={handleLogout}>
                  <ProviderPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/profile"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <Layout title="Provider" onLogout={handleLogout}>
                  <ProviderProfilePage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/notify_staff"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <Layout title="Provider" onLogout={handleLogout}>
                  <NotifyStaffPage />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/notify_staff_calendar"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <NotificationStaffCalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/view_calendar"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <ViewCalendarAppointmentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/clinics"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <Layout title="Staff" onLogout={handleLogout}>
                  <ProviderClinicDatabase />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/patients"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <Layout title="Staff" onLogout={handleLogout}>
                  <ProviderPatientDatabase />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/provider/completed-appointments"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <Layout title="Staff" onLogout={handleLogout}>
                  <ProviderCompleteAppointmentPage />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </BrowserRouter>
  );
}