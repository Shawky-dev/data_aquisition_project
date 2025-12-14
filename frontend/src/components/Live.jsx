import { useEffect, useRef, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function Live() {
  const [messages, setMessages] = useState([])
  const lastMessageRef = useRef(null)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")

    ws.onmessage = (event) => {
      try {
        const record = JSON.parse(event.data)
        setMessages((prev) => [
          ...prev,
          {
            distance: record.distance,
            time: new Date(record.timestamp).toLocaleTimeString(),
          },
        ])
      } catch (e) {
        console.error("Failed to parse message:", e)
      }
    }

    return () => ws.close()
  }, [])

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <Card className="mx-auto max-w-3xl">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Live Arduino Feed</CardTitle>
        <Badge variant="outline">WebSocket Active</Badge>
      </CardHeader>

      <CardContent>
        <ScrollArea className="h-[400px] rounded-md border p-4">
          {messages.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Waiting for sensor data...
            </p>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              ref={index === messages.length - 1 ? lastMessageRef : null}
              className="space-y-1"
            >
              <p className="text-xs text-muted-foreground">{msg.time}</p>
              <p className="text-sm">Motion Detected!: {msg.distance} cm</p>
              {index < messages.length - 1 && (
                <Separator className="my-2" />
              )}
            </div>
          ))}
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
