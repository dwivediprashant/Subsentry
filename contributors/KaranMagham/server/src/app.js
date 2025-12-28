import dotenv from "dotenv";
dotenv.config();  

import express from "express";
import connectDB from "./db.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running");
});

connectDB();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
