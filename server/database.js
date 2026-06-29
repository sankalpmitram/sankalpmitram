const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("./sankalp.db", (err) => {

    if (err) {

        console.error(err.message);

    } else {

        console.log("✅ SQLite Connected");

    }

});

db.serialize(() => {

    db.run(`

        CREATE TABLE IF NOT EXISTS panchang (

            id INTEGER PRIMARY KEY,

            weekday TEXT,
            paksha TEXT,
            tithi TEXT,
            nakshatra TEXT,
            yoga TEXT,
            karana TEXT,
            ritu TEXT,
            ayana TEXT,
            sunSign TEXT,
            moonSign TEXT,
            jupiterSign TEXT

        )

    `);

});

module.exports = db;