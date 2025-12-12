import "./wsServer.js";   // starts WebSocket server
import "./serial.js";     // starts serial communication
import { connectMongo } from "./mongo.js";

connectMongo();

console.log("Node.js server initialized...");
