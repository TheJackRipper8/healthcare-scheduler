import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pg from "pg";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

app.get("/health", async (req, res) => {
  const r = await pool.query("SELECT NOW() as now");
  res.json({ ok: true, time: r.rows[0].now });
});

app.listen(process.env.PORT || 3000, () =>
  console.log("API running at http://localhost:3000")
);
