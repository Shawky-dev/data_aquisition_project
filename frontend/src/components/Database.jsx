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

export default function Database() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    setLogs([
      {
        id: 1,
        timestamp: new Date().toISOString(),
        sensor: "Motion",
        value: "Detected",
      },
      {
        id: 2,
        timestamp: new Date(Date.now() - 600000).toISOString(),
        sensor: "Motion",
        value: "Clear",
      },
      {
        id: 3,
        timestamp: new Date(Date.now() - 1200000).toISOString(),
        sensor: "Motion",
        value: "Detected",
      },
    ])
  }, [])

  return (
    <Card className="mx-auto max-w-5xl">
      <CardHeader>
        <CardTitle>Event Database</CardTitle>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Sensor</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>
                  {new Date(log.timestamp).toLocaleString()}
                </TableCell>
                <TableCell>{log.sensor}</TableCell>
                <TableCell>
                  <Badge
                    variant={
                      log.value === "Detected"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {log.value}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
