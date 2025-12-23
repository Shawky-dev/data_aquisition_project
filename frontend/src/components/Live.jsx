import { useEffect, useRef, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Activity, Wifi, WifiOff, TrendingUp, Clock } from "lucide-react"

export default function Live() {
  const [messages, setMessages] = useState([])
  const [isConnected, setIsConnected] = useState(false)
  const [stats, setStats] = useState({ total: 0, avgDistance: 0, lastMinute: 0 })
  const lastMessageRef = useRef(null)
  const wsRef = useRef(null)

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8080")
    wsRef.current = ws

    ws.onopen = () => {
      setIsConnected(true)
    }

    ws.onclose = () => {
      setIsConnected(false)
    }

    ws.onerror = () => {
      setIsConnected(false)
    }

    ws.onmessage = (event) => {
      try {
        const record = JSON.parse(event.data)
        const newMessage = {
          distance: record.distance,
          time: new Date(record.timestamp).toLocaleTimeString(),
          timestamp: new Date(record.timestamp),
        }
        
        setMessages((prev) => {
          const updated = [...prev, newMessage]
          
          // Calculate stats
          const total = updated.length
          const avgDistance = updated.reduce((sum, m) => sum + m.distance, 0) / total
          const oneMinuteAgo = Date.now() - 60000
          const lastMinute = updated.filter(m => m.timestamp > oneMinuteAgo).length
          
          setStats({ total, avgDistance: avgDistance.toFixed(1), lastMinute })
          
          return updated
        })
      } catch (e) {
        console.error("Failed to parse message:", e)
      }
    }

    return () => ws.close()
  }, [])

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const getDistanceColor = (distance) => {
    if (distance < 50) return "text-red-500"
    if (distance < 100) return "text-yellow-500"
    return "text-green-500"
  }

  const getDistanceBadge = (distance) => {
    if (distance < 50) return "destructive"
    if (distance < 100) return "default"
    return "secondary"
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Alert */}
      {!isConnected && (
        <Alert variant="destructive">
          <WifiOff className="h-4 w-4" />
          <AlertDescription>
            WebSocket disconnected. Attempting to reconnect...
          </AlertDescription>
        </Alert>
      )}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Detections</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">
              Since session started
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Distance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDistance} cm</div>
            <p className="text-xs text-muted-foreground">
              Across all readings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Minute</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lastMinute}</div>
            <p className="text-xs text-muted-foreground">
              Recent detections
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Live Feed Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 animate-pulse text-green-500" />
                Live Arduino Feed
              </CardTitle>
              <CardDescription>Real-time motion detection data stream</CardDescription>
            </div>
            <Badge variant={isConnected ? "default" : "destructive"} className="gap-1">
              {isConnected ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
              {isConnected ? "Connected" : "Disconnected"}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <ScrollArea className="h-[500px] rounded-md border p-4">
            {messages.length === 0 && (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <Activity className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
                  <p className="text-sm text-muted-foreground font-medium">
                    Waiting for sensor data...
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Motion events will appear here in real-time
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  ref={index === messages.length - 1 ? lastMessageRef : null}
                  className="group animate-in fade-in slide-in-from-bottom-2 duration-500"
                >
                  <div className="flex items-start justify-between rounded-lg border p-3 hover:bg-accent transition-colors">
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={getDistanceBadge(msg.distance)} className="font-mono">
                          {msg.distance} cm
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {index === messages.length - 1 && (
                            <span className="text-green-500 font-medium">● LIVE</span>
                          )}
                        </span>
                      </div>
                      <p className={`text-sm font-medium ${getDistanceColor(msg.distance)}`}>
                        Motion Detected!
                      </p>
                    </div>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {msg.time}
                    </div>
                  </div>
                  {index < messages.length - 1 && (
                    <Separator className="my-2" />
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  )
}