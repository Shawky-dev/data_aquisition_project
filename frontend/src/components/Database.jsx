import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card"
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default function Database() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchDetections = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_URL}/api/detections`)
        if (!response.ok) {
          throw new Error("Failed to fetch detections")
        }
        const data = await response.json()
        setLogs(data)
      } catch (err) {
        console.error("Error fetching detections:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchDetections()
  }, [])

  if (loading) {
    return (
      <Card className="mx-auto max-w-5xl">
        <CardHeader>
          <CardTitle>Event Database</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mx-auto max-w-5xl">
        <CardHeader>
          <CardTitle>Event Database</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-red-500">Error: {error}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader>
        <CardTitle>Event Database</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Timestamp</TableHead>
              <TableHead>Distance</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {logs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No detections recorded yet
                </TableCell>
              </TableRow>
            ) : (
              logs.map((log) => (
                <TableRow key={log._id}>
                  <TableCell className="font-mono text-xs">{log._id}</TableCell>
                  <TableCell>
                    {new Date(log.timestamp).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.distance} cm</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
