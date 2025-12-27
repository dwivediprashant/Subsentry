const cors = require("cors");
require("dotenv").config();
const express = require("express");
const mongoConnect = require("./utils/mongoConnect");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Server is running...");
});



const PORT = process.env.PORT || 5000;

mongoConnect().then(() => {
  console.log("Connected to MongoDB");
  app.listen(PORT, () => console.log(`Server running on port ${PORT}, Click http://localhost:${PORT}`));
});
