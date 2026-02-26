// Import Express framework for node.js
import express from "express";
// CORS helps frontend interact with backend
import cors from "cors";
// Loads .env variables into process.env like PORT, SQLITE_PATH, SESSION_SECRET
import dotenv from "dotenv";
// route handler functions
import handlers from "./handlers.js";
import db from "./db.js"; 
// session support for express backend
import session from "express-session";

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

// Handler for login
app.post("/api/login", handlers.login);
// Handler for book appointment
app.post("/api/appointments", handlers.bookAppointment);
// Handler for cancel appointment
app.post("/api/appointments/:id/cancel", handlers.cancelAppointment);
// Handler for get daily appointments
app.get("/api/appointments/daily", handlers.getDailyAppointments);
// Handler for get weekly appointments
app.get("/api/appointments/weekly", handlers.getWeeklyAppointments);
// Handler for get upcoming appointments
app.get("/api/appointments/upcoming", handlers.getUpcomingAppointments);
// Handler for get past appointments
app.get("/api/appointments/past", handlers.getPastAppointments);
// Handler for sending notifications
app.post("/api/notifications/send", handlers.sendNotification);
// Handler for getting notifications
app.get("/api/notifications", handlers.getNotifications);
// Handler for marking resolved or notied notifications
app.post("/api/notifications/:id/read", handlers.markNotificationRead);

// Initiliaze port and listen to requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));

// secret - used to sign into session cookie data
// resave - false means do not resave session if nothing change, true means opposite
// saveUnitiliazed - false means do not create a session unless data is stored or user logged in
// cookie
//      httpOnly - frontend cannot read cookie data (security)
//      sameSite - lax protects against CSRF attacks
//      secure - false (for local HTTP, not HTTPS)
//      maxAge - cookie time
app.use(session({
  secret: process.env.SESSION_SECRET || "dev_secret_change_me",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 1000 * 60 * 60 * 2
  }
}));