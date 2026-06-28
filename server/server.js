const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();

// CORS Enable
app.use(cors());

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
// Today Route
// ----------------------
app.get("/today", async (req, res) => {

  try {

    // Token
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

    // Common Params
    const params = {
      ayanamsa: 1,
      coordinates: "26.2389,73.0243",
      datetime: new Date().toISOString(),
      la: "hi"
    };

    // तीनों API एक साथ
    const [panchang, ritu, planet] = await Promise.all([

      axios.get(
        "https://api.prokerala.com/v2/astrology/panchang",
        {
          headers: { Authorization: `Bearer ${token}` },
          params
        }
      ),

      axios.get(
        "https://api.prokerala.com/v2/astrology/ritu",
        {
          headers: { Authorization: `Bearer ${token}` },
          params
        }
      ),

      axios.get(
        "https://api.prokerala.com/v2/astrology/planet-position",
        {
          headers: { Authorization: `Bearer ${token}` },
          params: {
            ...params,
            planets: "0,1,5"
          }
        }
      )

    ]);
const ayana =
["मकर","कुम्भ","मीन","मेष","वृषभ","मिथुन"].includes(
planet.data.data.planet_position[0].rasi.name
)
? "उत्तरायने"
: "दक्षिणायने";

    res.json({

  status: "ok",

  weekday: panchang.data.data.vaara,

  paksha: panchang.data.data.tithi[0].paksha,

  tithi: panchang.data.data.tithi[0].name,

  nakshatra: panchang.data.data.nakshatra[0].name,

  yoga: panchang.data.data.yoga[0].name,

  karana: panchang.data.data.karana[0].name,

  ritu: ritu.data.data.vedic_ritu.name,

  sunSign: planet.data.data.planet_position[0].rasi.name,

  moonSign: planet.data.data.planet_position[1].rasi.name,

  jupiterSign: planet.data.data.planet_position[2].rasi.name,
  ayana: ayana,


});
  } catch (error) {

    console.log(error.response?.data || error.message);

    res.status(500).json(
      error.response?.data || { error: error.message }
    );

  }

});

// ----------------------
// Server Start
// ----------------------
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});