// server.js
import { SerialPort, ReadlineParser } from 'serialport';
import { MongoClient } from "mongodb";
import { WebSocketServer } from "ws";

const client = new MongoClient(process.env.MONGO_URL);

async function runMongo() {
  try {
    await client.connect();
    console.log("Connected to MongoDB");
  } catch (e) {
    console.error("Mongo error:", e);
  }
}
runMongo();

// ---- Arduino Serial Connection ----
const port = new SerialPort({
  path: '/dev/ttyACM0',
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// ---- WebSocket Server ----
const wss = new WebSocketServer({ port: 8080 });
console.log("WebSocket server running on ws://localhost:8080");

// Send to **all connected clients**
function broadcast(msg) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
}

// Listen for Arduino data
parser.on('data', (data) => {
  console.log("Arduino says:", data);
  broadcast(data);
});

// Optional: send message to Arduino every 2 seconds
setInterval(() => {
  const timestamp = new Date().toISOString();
  port.write(`Hello Arduino - ${timestamp}\n`);
}, 2000);

console.log("Node.js server running...");
