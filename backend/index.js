
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import handlers from "./handlers.js";
import db from "./db.js"; 

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.get("/api/health", (req, res) => res.json({ ok: true }));

app.post("/api/login", handlers.login);

app.post("/api/appointments", handlers.bookAppointment);
app.post("/api/appointments/:id/cancel", handlers.cancelAppointment);
app.get("/api/appointments/daily", handlers.getDailyAppointments);
app.get("/api/appointments/weekly", handlers.getWeeklyAppointments);
app.get("/api/appointments/upcoming", handlers.getUpcomingAppointments);
app.get("/api/appointments/past", handlers.getPastAppointments);

app.post("/api/notifications/send", handlers.sendNotification);
app.get("/api/notifications", handlers.getNotifications);
app.post("/api/notifications/:id/read", handlers.markNotificationRead);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
