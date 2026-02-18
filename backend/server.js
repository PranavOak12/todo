const express = require("express");
const cors = require("cors");
const path = require("path");
const sqlite3 = require("sqlite3").verbose();

const app = express();
const PORT = 3000;

/* =======================
   MIDDLEWARE
======================= */

// ✅ CORS (frontend on 5173)
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());

// serve frontend (only if you have /public)
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
    function () {
      res.json({ id: this.lastID, text });
    }
  );
});

app.delete("/api/todos/:id", (req, res) => {
  db.run("DELETE FROM todos WHERE id = ?", [req.params.id], () => {
    res.json({ success: true });
  });
});

/* =======================
   START SERVER
======================= */

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
