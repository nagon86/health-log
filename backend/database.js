const sqlite3 = require("sqlite3").verbose();

let db;

function initDatabase() {
  db = new sqlite3.Database("data/data.db", (err) => {
    if (err) console.error("Error opening database", err);
    db.run(
      `CREATE TABLE IF NOT EXISTS entries (
                date TEXT PRIMARY KEY,
                headache INTEGER NOT NULL,
                shoulderache INTEGER NOT NULL,
                medicine TEXT NOT NULL,
                text TEXT NOT NULL,
                modification_time TEXT NOT NULL
            )`
    );
  });
}

function insertData(date, headache, shoulderache, medicine, text, callback) {
  db.run(
    "INSERT INTO entries (date, headache, shoulderache, medicine, text, modification_time) VALUES (?, ?, ?, ?, ?, datetime('now'))",
    [date, headache, shoulderache, JSON.stringify(medicine), text],
    callback
  );
}

function updateData(date, headache, shoulderache, medicine, text, callback) {
  const sql = `UPDATE entries
    SET headache = ?,
        shoulderache = ?,
        medicine = ?,
        text = ?,
        modification_time = datetime('now')
    WHERE
        date = ?`;
  db.run(sql, [headache, shoulderache, medicine, text, date], callback);
}

function fetchData(startDate, endDate, callback) {
  db.all(
    "SELECT * FROM entries WHERE date BETWEEN ? AND ?",
    [startDate, endDate],
    (err, rows) => {
      if (err) {
        console.error("Error fetching data", err);
        const date = new Date(startDate);
        callback([
          {
            date: date.toISOString(),
            headache: 0,
            shoulderache: 0,
            medicine: {},
            text: "",
            modification_time: date.toISOString(),
          },
        ]);
      }

      rows.forEach((element) => {
        try {
          element.medicine = JSON.parse(element.medicine);
        } catch (error) {
          element.medicine = {};
        }
      });
      callback(rows);
    }
  );
}

module.exports = { initDatabase, insertData, updateData, fetchData };
