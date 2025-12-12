import { useEffect, useRef, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  const [messages, setMessages] = useState([]);
  const scrollAreaRef = useRef(null);
  const lastMessageRef = useRef(null);

  // WebSocket connection
  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080");

    ws.onmessage = (event) => {
      setMessages(prev => [
        ...prev,
        {
          text: event.data,
          time: new Date().toLocaleTimeString(),
        }
      ]);
    };

    return () => ws.close();
  }, []);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-6">
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Arduino Log</CardTitle>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-96 border rounded-md bg-white p-4">
            {messages.map((msg, idx) => (
              <div 
                className="mb-3" 
                key={idx}
                ref={idx === messages.length - 1 ? lastMessageRef : null}
              >
                <div className="text-sm text-gray-500">{msg.time}</div>
                <div className="text-md">{msg.text}</div>
                {idx < messages.length - 1 && <Separator className="my-2" />}
              </div>
            ))}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}