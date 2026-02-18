const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = process.env.PORT || 3000;

/* =======================
   CORS CONFIG
======================= */

const allowedOrigins = [
  "https://todooo-7hup24pb6-pranavs-projects-53c10624.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin (Postman, curl, server-side)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

/* =======================
   MIDDLEWARE
======================= */

app.use(express.json());

// serve frontend (optional)
app.use(express.static(path.join(__dirname, "public")));

/* =======================
   DATABASE
======================= */

const db = new sqlite3.Database("./db.sqlite");

db.run(`
  CREATE TABLE IF NOT EXISTS todos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    text TEXT NOT NULL
  )
`);

/* =======================
   API ROUTES
======================= */

app.get("/api/todos", (req, res) => {
  db.all("SELECT * FROM todos", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post("/api/todos", (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: "Text is required" });

  db.run(
    "INSERT INTO todos (text) VALUES (?)",
    [text],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, text });
    }
  );
});

app.delete("/api/todos/:id", (req, res) => {
  db.run("DELETE FROM todos WHERE id = ?", [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

/* =======================
   START SERVER
======================= */

app.listen(PORT, () => {
  console.log(`✅ Backend running on port ${PORT}`);
});
