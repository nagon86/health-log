const sqlite3 = require("sqlite3").verbose();

let db;

function initDatabase() {
    db = new sqlite3.Database("data.db", (err) => {
        if (err) console.error("Error opening database", err);
        db.run(
            `CREATE TABLE IF NOT EXISTS entries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                date TEXT NOT NULL,
                category TEXT NOT NULL,
                text TEXT NOT NULL
            )`
        );
    });
}

function insertData(date, category, text) {
    db.run("INSERT INTO entries (date, category, text) VALUES (?, ?, ?)", [date, category, text]);
}

function fetchData(startDate, endDate, callback) {
    db.all("SELECT * FROM entries WHERE date BETWEEN ? AND ?", [startDate, endDate], (err, rows) => {
        if (err) console.error(err);
        callback(rows);
    });
}

module.exports = { initDatabase, insertData, fetchData };
