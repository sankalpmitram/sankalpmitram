const db = require("./database");
const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const app = express();
app.use(express.json());

// CORS Enable
app.use(cors());
// =======================
// Admin Panel
// =======================

app.use(
  "/admin",
  express.static(path.join(__dirname, "admin"))
);

// ----------------------
// Token Route
// ----------------------
app.get("/token", async (req, res) => {
  try {
    const response = await axios.post(
      "https://api.prokerala.com/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    res.json({
  success: true,
  data: response.data.data
});
  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: error.message });
  }
});

// ----------------------
// Panchang Route
// ----------------------
app.get("/panchang", async (req, res) => {
  try {
    // Access Token प्राप्त करें
    const tokenResponse = await axios.post(
      "https://api.prokerala.com/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = tokenResponse.data.access_token;

    // Panchang API Call
    const response = await axios.get(
      "https://api.prokerala.com/v2/astrology/panchang",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ayanamsa: 1,
          coordinates: "26.2389,73.0243", // Jodhpur
          datetime: new Date().toISOString(),
          la: "hi",
        },
      }
    );

    res.json(response.data);

  } catch (error) {
    console.log(error.response?.data || error.message);
    res.status(500).json(error.response?.data || { error: error.message });
  }
});

// ----------------------
// Ritu Route
// ----------------------
app.get("/ritu", async (req, res) => {

  try {

    const tokenResponse = await axios.post(
      "https://api.prokerala.com/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = tokenResponse.data.access_token;

    const response = await axios.get(
      "https://api.prokerala.com/v2/astrology/ritu",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ayanamsa: 1,
          coordinates: "26.2389,73.0243",
          datetime: new Date().toISOString(),
          la: "hi",
        },
      }
    );

    res.json(response.data);

  } catch (error) {

    console.log(error.response?.data || error.message);

    res.status(500).json(
      error.response?.data || { error: error.message }
    );

  }

});

// ----------------------
// Planet Position Route
// ----------------------
app.get("/planet", async (req, res) => {

  try {

    // Access Token
    const tokenResponse = await axios.post(
      "https://api.prokerala.com/token",
      new URLSearchParams({
        grant_type: "client_credentials",
        client_id: process.env.CLIENT_ID,
        client_secret: process.env.CLIENT_SECRET,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const token = tokenResponse.data.access_token;

    // Planet Position API
    const response = await axios.get(
      "https://api.prokerala.com/v2/astrology/planet-position",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          ayanamsa: 1,
          coordinates: "26.2389,73.0243",
          datetime: new Date().toISOString(),
          planets: "0,1,5",
          la: "hi",
        },
      }
    );

    res.json(response.data);

  } catch (error) {

    console.log(error.response?.data || error.message);

    res.status(500).json(
      error.response?.data || { error: error.message }
    );

  }

});

// ----------------------
// Today Route (SQLite)
// ----------------------
app.get("/today", (req, res) => {

    db.get(
        "SELECT * FROM panchang WHERE id = 1",
        [],
        (err, row) => {

            if (err) {
                return res.status(500).json({
                    success: false,
                    error: err.message
                });
            }

            if (!row) {
                return res.status(404).json({
                    success: false,
                    message: "No Panchang data found"
                });
            }

            res.json(row);

        }
    );

});
// =======================
// Admin Login
// =======================

app.post("/login", (req, res) => {

    const { username, password } = req.body;

    if (
        username === process.env.ADMIN_USERNAME &&
        password === process.env.ADMIN_PASSWORD
    ) {

        res.json({
            success: true
        });

    } else {

        res.status(401).json({
            success: false,
            message: "Invalid Username or Password"
        });

    }

});
// =======================
// Save Panchang
// =======================

app.post("/save", (req, res) => {

    const {
        weekday,
        paksha,
        tithi,
        nakshatra,
        yoga,
        karana,
        ritu,
        ayana,
        sunSign,
        moonSign,
        jupiterSign
    } = req.body;

    db.run("DELETE FROM panchang");

    db.run(

        `INSERT INTO panchang
        (
            id,
            weekday,
            paksha,
            tithi,
            nakshatra,
            yoga,
            karana,
            ritu,
            ayana,
            sunSign,
            moonSign,
            jupiterSign
        )
        VALUES (1,?,?,?,?,?,?,?,?,?,?,?)`,

        [
            weekday,
            paksha,
            tithi,
            nakshatra,
            yoga,
            karana,
            ritu,
            ayana,
            sunSign,
            moonSign,
            jupiterSign
        ],

        function(err){

            if(err){

                return res.status(500).json({
                    success:false,
                    error:err.message
                });

            }

            res.json({
                success:true
            });

        }

    );

});

// ----------------------
// Server Start
// ----------------------
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});