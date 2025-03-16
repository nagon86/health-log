const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const jwt = require("jsonwebtoken");
const {
  initDatabase,
  insertData,
  updateData,
  fetchData,
} = require("./database");
const authMiddleware = require("./authMiddleware");
const fs = require("fs");

require("dotenv").config();
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? [...process.env.ALLOWED_ORIGINS.split(',')]
  : [];

let medicines = {};
function loadMedicines() {
  try {
    const data = fs.readFileSync(process.env.MEDICINES_FILE, "utf8");
    medicines = JSON.parse(data);
  } catch (err) {
    console.error("Could not load medicines.json", err);
  }
}
loadMedicines();

const app = express();
const port = process.env.PORT || 3001;

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'", ...allowedOrigins],
      upgradeInsecureRequests: [],
    },
    reportOnly: true,
  },
}));
app.use(cors({
  origin: function (origin, callback) {
    console.log("CORS-Origin:", origin);
    if (!origin) {
      console.log("No origin");
      return callback(null, true);
    }
    if (allowedOrigins.indexOf(origin) !== -1) {
      console.log("Whitelisted");
      return callback(null, true);
    }
    console.log("Not allowed by CORS");
    return callback(new Error("Not allowed by CORS"));
  },
}));
app.use(bodyParser.json());

// Serve frontend static files
app.use(express.static(path.join(__dirname, "public")));

// Initialize database
initDatabase();

// Authentication endpoint
app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === process.env.ADMIN_USER &&
    password === process.env.ADMIN_PASS
  ) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  }
  res.status(401).json({ message: "Invalid credentials" });
});

// Protected routes
app.post("/api/data", authMiddleware, (req, res) => {
  const { date, headache, shoulderache, medicine, text } = req.body;
  if (!date || !headache || !shoulderache || !medicine) {
    res.status(400).json({ message: "Missing required fields" });
  }
  insertData(date, headache, shoulderache, medicine, text, (err, result) => {
    if (err) {
      res.status(409).json({ message: "Entry for this date already exists" });
      return;
    }
    res.json({ message: "Data added successfully" });
  });
});

app.put("/api/data", authMiddleware, (req, res) => {
  const { date, headache, shoulderache, medicine, text } = req.body;
  if (!date || !headache || !shoulderache || !medicine) {
    res.status(400).json({ message: "Missing required fields" });
  }
  updateData(date, headache, shoulderache, medicine, text, (err, result) => {
    if (err) {
      res.status(404).json(err);
      return;
    }
    res.json(result);
  });
});

app.get("/api/data", authMiddleware, (req, res) => {
  const { startDate, endDate } = req.query;
  fetchData(startDate, endDate, (rows) => res.json(rows));
});

app.get("/api/medicines", authMiddleware, (req, res) => {
  res.json({ ...medicines });
});

// Catch-all route to serve React frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.listen(port, () =>
  console.log(`Server running on http://localhost:${port}`)
);
