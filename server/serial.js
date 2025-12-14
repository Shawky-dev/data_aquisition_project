import { SerialPort, ReadlineParser } from "serialport";
import { broadcast } from "./wsServer.js";

const port = new SerialPort({
  path: "/dev/ttyACM1",
  baudRate: 9600,
});

const parser = port.pipe(new ReadlineParser({ delimiter: "\r\n" }));

parser.on("data", (data) => {
  const timestamp = new Date().toLocaleString();
  let msg = `${timestamp}: ${data}`;
  console.log(msg);
  broadcast(msg);
});

// // Optional: send message to Arduino every 2 seconds
// setInterval(() => {
//   const timestamp = new Date().toLocaleString();
//   port.write(`Hello Arduino - ${timestamp}\n`);
// }, 2000);

console.log("Arduino serial running...");

export default port;
