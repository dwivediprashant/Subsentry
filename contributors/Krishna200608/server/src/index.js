import "dotenv/config"; 
import express from "express";
import connectDB from "./config/db.js";
import cors from "cors";
import subscriptionRoutes from "./routes/subscription.routes.js";


const app = express();

// Middlewares -------------------
app.use(cors());
app.use(express.json());
app.use("/api/subscriptions", subscriptionRoutes);

// API routes ------------------
app.get("/", (_, res) => {
	res.send("Server is Live!");
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

const PORT = process.env.PORT || 5000;
const HOST = process.env.HOST || "http://localhost";

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running at: ${HOST}:${PORT}`);
  });
};

startServer();
