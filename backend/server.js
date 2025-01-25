const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { initDatabase, insertData, fetchData } = require("./database");
const authMiddleware = require("./authMiddleware");
const fs = require("fs");

require("dotenv").config();

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
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Initialize database
initDatabase();

// Authentication endpoint
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: "1h" });
        return res.json({ token });
    }
    res.status(401).json({ message: "Invalid credentials" });
});

// Protected routes
app.post("/data", authMiddleware, (req, res) => {
    const { date, headache, shoulderache, medicine, text } = req.body;
    insertData(date, headache, shoulderache, medicine, text);
    res.json({ message: "Data inserted successfully" });
});

app.get("/data", authMiddleware, (req, res) => {
    const { startDate, endDate } = req.query;
    fetchData(startDate, endDate, (rows) => res.json(rows));
});

app.get("/medicines", authMiddleware, (req, res) => {
    res.json({...medicines});
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
