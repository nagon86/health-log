const sqlite3 = require("sqlite3").verbose();

let db;

function initDatabase() {
    db = new sqlite3.Database("data.db", (err) => {
        if (err) console.error("Error opening database", err);
        db.run(
            `CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                headache INTEGER NOT NULL,
                shoulderache INTEGER NOT NULL,
                medicine TEXT NOT NULL,
                text TEXT NOT NULL,
                modification_time TEXT NOT NULL
            )`
        );
    });
}

function insertData(date, headache, shoulderache, medicine, text) {
    db.run("INSERT INTO entries (date, headache, shoulderache, medicine, text, modification_time) VALUES (?, ?, ?, ?, ?, datetime('now'))",
        [date, headache, shoulderache, JSON.stringify(medicine), text]);
}

function fetchData(startDate, endDate, callback) {
    db.all("SELECT * FROM entries WHERE date BETWEEN ? AND ?", [startDate, endDate], (err, rows) => {
        if (err) {
            console.error(err);
            const date = new Date(startDate);
            callback([{
                "date": date.toISOString(),
                "headache": 0,
                "shoulderache": 0,
                "medicine": {},
                "text": "",
                "modification_time": date.toISOString(),
            }]);
        }

        rows.forEach(element => {
            element.medicine = JSON.parse(element.medicine)
        });
        callback(rows);
    });
}

module.exports = { initDatabase, insertData, fetchData };
