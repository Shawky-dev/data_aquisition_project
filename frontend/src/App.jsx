import { useEffect, useState } from "react";

function App() {
  const [arduinoData, setArduinoData] = useState("");

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      console.log("Received from server:", event.data);
      setArduinoData(event.data);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-2xl font-bold">Arduino Data:</h1>
      <p className="text-xl mt-4">{arduinoData}</p>
    </div>
  );
}

export default App;
