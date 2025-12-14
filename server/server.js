import express from "express";
import cors from "cors";
import "./wsServer.js";   // starts WebSocket server
import "./serial.js";     // starts serial communication
import { connectMongo, getAllDetections } from "./mongo.js";

const app = express();
const PORT = process.env.API_PORT || 3000;

app.use(cors());
app.use(express.json());

// API endpoint to get all detections
app.get("/api/detections", async (req, res) => {
  try {
    const detections = await getAllDetections();
    res.json(detections);
  } catch (error) {
    console.error("Error fetching detections:", error);
    res.status(500).json({ error: "Failed to fetch detections" });
  }
});

connectMongo();

app.listen(PORT, () => {
  console.log(`HTTP API server running on port ${PORT}`);
});

console.log("Node.js server initialized...");
