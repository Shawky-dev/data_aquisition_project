import { SerialPort, ReadlineParser } from 'serialport';
import { MongoClient } from "mongodb";

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


const port = new SerialPort({
  path: '/dev/ttyACM0',
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\r\n' }));

// Listen for data from Arduino
parser.on('data', (data) => {
  console.log('Arduino says:', data);
});

// Send data TO Arduino every 2 seconds
setInterval(() => {
  port.write("Hello Arduino\n");
}, 2000);

console.log("Node.js is running and connected to Arduino...");
