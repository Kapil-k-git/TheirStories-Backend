import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
    origin: "http://localhost:3000"
}));

app.get("/api/interviews", async (req, res) => {
  try {
    const { GOOGLE_API_KEY, SHEET_ID, SHEET_NAME } = process.env;

    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${SHEET_NAME}?key=${GOOGLE_API_KEY}`;

    const response = await axios.get(url);

    const [headers, ...rows] = response.data.values;

    const data = rows.map(row => {
      let obj = {};
      headers.forEach((key, index) => {
        if (key !== "Compellingness") {
          obj[key] = row[index] || "";
        }
      });
      return obj;
    });

    res.json(data);

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});