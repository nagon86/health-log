const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { initDatabase, insertData, fetchData } = require("./database");
const authMiddleware = require("./authMiddleware");
require("dotenv").config();

const app = express();
const port = 3000;

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
    const { date, category, text } = req.body;
    insertData(date, category, text);
    res.json({ message: "Data inserted successfully" });
});

app.get("/data", authMiddleware, (req, res) => {
    const { startDate, endDate } = req.query;
    fetchData(startDate, endDate, (rows) => res.json(rows));
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));
