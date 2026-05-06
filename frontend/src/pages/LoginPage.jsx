import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
// Firebase function for logging in with email and password
import { signInWithEmailAndPassword } from "firebase/auth";
// Get auth object from firebase.js
import { auth } from "../firebase";
// Get auth context that has authentication details (for app)
import { useAuth } from "../auth/AuthContext";

export default function LoginPage() {
    // Navigate function aterlogging in
    const navigate = useNavigate();
    // get setUser from AuthContext, stores logged-in user data in React state (who and what role)
    const { setUser } = useAuth();
    // Set up states for email, password, error, loading and their functions
    // Stores email, password, and ability to modify them
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    // Error message if login fails
    const [error, setError] = useState("");
    // Whether login is currently in progress
    const [loading, setLoading] = useState(false);
    
    // Login handler responsible for ogging in
    // Async - Firebase and backend 
    async function handleLogin(e) 
    {
        // Prevent browser from doing HTML form submit, would cause reload
        e.preventDefault();
        // Before logging in, clear any error and set loading state to true
        setError("");
        setLoading(true);

        try 
        {
            // Attempt to login with auth, email and password
            // If wrong, goes to catch statement
            await signInWithEmailAndPassword(auth, email, password);
            // Get authentication token if login succeeds
            // Token proves to backend user is authenticated
            const token = await auth.currentUser.getIdToken();
            // Get response from account (fetch the data response from account data fetch request)
            // Request to backend route /api/me to verify token with backend and look up user
            const res = await fetch("/api/me", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
            });

            // Get data from response and convert into JSON
            // Contains role and document
            const data = await res.json();

            // If response is not OK, send error for login failture
            if (!res.ok) {
                throw new Error(data.error || "Login failed");
            }

            // Otherwise, use the data and initialize the client
            // Stores user data as part of user React object
            setUser(data.user);
            // redirect to correct hub depending on whether patient, staff, or provider
            // If none, go to unauthorized
            if (data.user.role === "patient")
                navigate("/patient/hub");
            else if (data.user.role === "staff")
                navigate("/staff/hub");
            else if (data.user.role === "provider")
                navigate("/provider/hub");
            else
                navigate("/unauthorized");
        } 
        catch (err) 
        {
            // Login failure
            navigate("/unauthorized", { replace: true });
            setError(err.message || "Unable to sign in");
        } 
        finally 
        {
            // Stops loading after login or fail
            setLoading(false);
        }
    }

    return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="w-full max-w-3xl bg-white border border-gray-300 rounded-xl shadow-sm p-6">
            {/* Page title */}
            <h1 className="text-4xl font-bold text-indigo-600 text-center">
                Login Page
            </h1>
            {/* Form that calls handleLogin*/}
            <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                    {/* Ask for email address*/}
                    <label className="block text-sm font-medium text-gray-700">
                        Email Address
                    </label>
                    {/* Assign to react object email*/}
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                <div>
                    {/* Ask for password */}
                    <label className="block text-sm font-medium text-gray-700">
                        Password
                    </label>
                    {/* Assign to password react object */}
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="mt-1 w-full rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>
                {/* If error from handler, display it*/}
                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}
                {/* Submit button, loading*/}
                {/* if loading is true, show Signing IN... else Sign In */}
                <button
                    type="submit"
                    disabled={loading}
                    className="mt-2 w-full sm:w-auto px-6 py-2 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-60"
                    >
                    {loading ? "Signing In..." : "Sign In"}
                </button>
            </form>
        </div>
    </div>
    );
}