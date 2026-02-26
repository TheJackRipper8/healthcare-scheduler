import React from "react";
// BrowserRouter = enabgles client-side routing, allows app changes without app reload
// Routes = container for Route
// Route = defines URL path to a component (module)
// Link = like <a> in HTML, for React
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
// Import useAuth function from AuthContext
// Returns the current data of the logged in user
import { useAuth } from "./auth/AuthContext";

import LoginPage from "./pages/LoginPage";
import PatientPage from "./pages/PatientPage";
import ProviderPage from "./pages/ProviderPage";
import StaffPage from "./pages/StaffPage";
import BookAppointmentPage from "./pages/BookAppointmentPage";
import CancelAppointmentPage from "./pages/CancelAppointmentPage";

// Wrapper that protects pages accessed by roles
// allowedRoles refers to staff, providers, patients
// children referse to the page components of each role
function ProtectedRoute({ allowedRoles, children }) {
  {/* Call the function */}
  const { user } = useAuth();
  {/* If no user logged in, redirect to login page */}
  if (!user) 
    return <Navigate to="/login" replace />;
  {/* Check if the user.role is an authroized role in allowedRoles */}
  {/* If not, navigate to unauhtorized page */}
  if (!allowedRoles.includes(user.role)) 
    return <Navigate to="/unauthorized" replace />;
  {/* front-end access privilleages */}
  return children;
}

export default function App() {
  {/*
    user = currently logged in
    setUser = the function that sets up the UI for user
  */}
  const { user, setUser } = useAuth();

  return (
    <BrowserRouter>
      <header className="bg-white shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 py-3 flex gap-4 items-center">
          {/*
              Start at the home page (default)
          */}
          <Link to="/" className="font-medium text-indigo-600">Home</Link>

          {/*
              Check if user is patient, then load patient page
              Check if user is provider, then load provider page
              Check if user is staff, then load staff page
          */}          
          {user?.role === "patient" && <Link to="/patient">Patient</Link>}
          {user?.role === "provider" && <Link to="/provider">Provider</Link>}
          {user?.role === "staff" && <Link to="/staff">Staff</Link>}

          <div className="ml-auto">
            {/*
              Check if user is true (logged in)
              If logged in, then create a HTML button for logout
              If user clicks on the Logout button with a given role,
              setUser will be set to null to log out theuser
              If user is not logged in, redirect to login page
            */}
            {user ? (
              <button
                className="px-3 py-1 rounded bg-slate-100"
                onClick={async () => {
                  {/*
                      /api/logoiut destroys session (cookie)
                      setting user to null causes UI updates to remove it
                      so no other roles can access it
                  */}
                  await fetch("/api/logout", { method: "POST", credentials: "include" });
                  setUser(null);
                }}
              >
                Logout ({user.role})
              </button>
            ) : (
              <Link to="/login" className="px-3 py-1 rounded bg-slate-100">Login</Link>
            )}
          </div>
        </nav>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        <Routes>
          {/*
              If user not logged in, redirect them to LoginPage
          */}
          <Route path="/login" element={<LoginPage />} />
          {/*
              If allowedRoles is "patient" (ProtectedRoute if matching role)
              then redirect to PatientPage.
          */}
          <Route
            path="/patient"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <PatientPage />
              </ProtectedRoute>
            }
          />
          {/*
              Route to cancel appointment page by patient
          */}
          <Route
            path="/patient/cancel"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <CancelAppointmentPage />
              </ProtectedRoute>
            }
          />
          {/*
              Route to cancel appointment by patient
          */}
          <Route
            path="/patient/book_appointment"
            element={
              <ProtectedRoute allowedRoles={["patient"]}>
                <BookAppointmentPage />
              </ProtectedRoute>
            }
          />
          {/*
              If allowedRoles is "provider" (ProtectedRoute if matching role)
              then redirect to ProviderPage.
          */}
          <Route
            path="/provider"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <ProviderPage />
              </ProtectedRoute>
            }
          />
          {/*
              Route to notify staff by provider
          */}
          <Route
            path="/provider/notify_staff"
            element={
              <ProtectedRoute allowedRoles={["provider"]}>
                <NotifyStaffPage />
              </ProtectedRoute>
            }
          />

          {/*
              If allowedRoles is "staff" (ProtectedRoute if matching role)
              then redirect to StaffPage.
          */}
          <Route
            path="/staff"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <StaffPage />
              </ProtectedRoute>
            }
          />

          {/*
              Route to book appointment by staff
          */}
          <Route
            path="/staff/book_appointment"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <BookAppointmentPage />
              </ProtectedRoute>
            }
          />
          {/*
              Route to cancel appointment by staff
          */}
          <Route
            path="/staff/cancel"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <CancelAppointmentPage />
              </ProtectedRoute>
            }
          />
          {/*
              Route to notify patient by staff
          */}
          <Route
            path="/staff/notify_patient"
            element={
              <ProtectedRoute allowedRoles={["staff"]}>
                <NotifyPatientPage />
              </ProtectedRoute>
            }
          />
          {/*
              If not logged in and not a valid role, redirect to unauhtorized page
          */}
          <Route path="/unauthorized" element={<div>Unauthorized</div>} />
          <Route path="/" element={<div>Landing</div>} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}