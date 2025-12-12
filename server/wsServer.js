import { WebSocketServer } from "ws";

export const wss = new WebSocketServer({ port: 8080 });

console.log("WebSocket server running on ws://localhost:8080");

export function broadcast(msg) {
  wss.clients.forEach(client => {
    if (client.readyState === 1) client.send(msg);
  });
}
