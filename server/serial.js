import { SerialPort, ReadlineParser } from "serialport";
import { broadcast } from "./wsServer.js";
import { saveMotionDetection } from "./mongo.js";

const serialPath = process.env.SERIAL_PORT || "/dev/ttyACM1";

const port = new SerialPort({
  path: serialPath,
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", async (data) => {
  // Save to MongoDB
  const record = await saveMotionDetection(data);

  // Broadcast to React clients (send the full record with timestamp)
  if (record) {
    broadcast(JSON.stringify(record));
  }
});

// // Optional: send message to Arduino every 2 seconds
// setInterval(() => {
//   const timestamp = new Date().toLocaleString();
//   port.write(`Hello Arduino - ${timestamp}\n`);
// }, 2000);

console.log("Arduino serial running...");

export default port;
