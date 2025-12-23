import { useEffect, useState } from "react"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
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
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Database, 
  RefreshCw, 
  Calendar, 
  Ruler,
  AlertCircle,
  TrendingUp,
  Download,
  Trash2,
  Filter
} from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000"

export default function DatabaseComponent() {
  const [logs, setLogs] = useState([])
  const [filteredLogs, setFilteredLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [distanceFilter, setDistanceFilter] = useState("all")
  const [stats, setStats] = useState({ total: 0, avgDistance: 0, minDistance: 0, maxDistance: 0 })

  const fetchDetections = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_URL}/api/detections`)
      if (!response.ok) {
        throw new Error("Failed to fetch detections")
      }
      const data = await response.json()
      setLogs(data)
      setFilteredLogs(data)
      
      // Calculate statistics
      if (data.length > 0) {
        const distances = data.map(d => d.distance)
        const avg = distances.reduce((a, b) => a + b, 0) / distances.length
        const min = Math.min(...distances)
        const max = Math.max(...distances)
        setStats({
          total: data.length,
          avgDistance: avg.toFixed(1),
          minDistance: min,
          maxDistance: max
        })
      }
    } catch (err) {
      console.error("Error fetching detections:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDetections()
  }, [])

  // Filter logs based on distance filter
  useEffect(() => {
    let filtered = logs

    // Apply distance filter
    if (distanceFilter === "close") {
      filtered = filtered.filter(log => log.distance < 50)
    } else if (distanceFilter === "medium") {
      filtered = filtered.filter(log => log.distance >= 50 && log.distance < 100)
    } else if (distanceFilter === "far") {
      filtered = filtered.filter(log => log.distance >= 100)
    }

    setFilteredLogs(filtered)
  }, [distanceFilter, logs])

  const getDistanceBadge = (distance) => {
    if (distance < 50) return "destructive"
    if (distance < 100) return "default"
    return "secondary"
  }

  const getDistanceLabel = (distance) => {
    if (distance < 50) return "Close"
    if (distance < 100) return "Medium"
    return "Far"
  }

  const exportToCSV = () => {
    const headers = ["ID", "Timestamp", "Distance (cm)", "Status"]
    const rows = filteredLogs.map(log => [
      log._id,
      new Date(log.timestamp).toLocaleString(),
      log.distance,
      getDistanceLabel(log.distance)
    ])
    
    const csv = [headers, ...rows].map(row => row.join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `detections_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
  }

  const clearFilters = () => {
    setDistanceFilter("all")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="mx-auto max-w-7xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Event Database
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center gap-3">
                <RefreshCw className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading detections...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="mx-auto max-w-7xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Event Database
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <Button 
              onClick={fetchDetections} 
              variant="outline"
              className="w-full sm:w-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Retry Connection
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Records</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {filteredLogs.length !== stats.total && `${filteredLogs.length} filtered`}
              {filteredLogs.length === stats.total && "All records"}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Distance</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgDistance} cm</div>
            <p className="text-xs text-muted-foreground mt-1">
              Mean detection distance
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Min Distance</CardTitle>
            <Ruler className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{stats.minDistance} cm</div>
            <p className="text-xs text-muted-foreground mt-1">
              Closest detection
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Max Distance</CardTitle>
            <Ruler className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{stats.maxDistance} cm</div>
            <p className="text-xs text-muted-foreground mt-1">
              Farthest detection
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Database Table */}
      <Card className="mx-auto max-w-7xl">
        <CardHeader>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Event Database
              </CardTitle>
              <CardDescription>
                Complete history of all motion detection events
              </CardDescription>
            </div>
            <div className="flex flex-wrap gap-2">
              <Button 
                onClick={exportToCSV} 
                variant="outline" 
                size="sm"
                disabled={filteredLogs.length === 0}
              >
                <Download className="mr-2 h-4 w-4" />
                Export CSV
              </Button>
              <Button 
                onClick={fetchDetections} 
                variant="outline" 
                size="sm"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant={distanceFilter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setDistanceFilter("all")}
            >
              <Filter className="mr-2 h-4 w-4" />
              All
            </Button>
            <Button
              variant={distanceFilter === "close" ? "destructive" : "outline"}
              size="sm"
              onClick={() => setDistanceFilter("close")}
            >
              Close
            </Button>
            <Button
              variant={distanceFilter === "medium" ? "default" : "outline"}
              size="sm"
              onClick={() => setDistanceFilter("medium")}
            >
              Medium
            </Button>
            <Button
              variant={distanceFilter === "far" ? "secondary" : "outline"}
              size="sm"
              onClick={() => setDistanceFilter("far")}
            >
              Far
            </Button>
            {distanceFilter !== "all" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px]">ID</TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Timestamp
                    </div>
                  </TableHead>
                  <TableHead>
                    <div className="flex items-center gap-1">
                      <Ruler className="h-4 w-4" />
                      Distance
                    </div>
                  </TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {filteredLogs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center py-8">
                        {logs.length === 0 ? (
                          <>
                            <Database className="h-12 w-12 text-muted-foreground/50 mb-3" />
                            <p className="text-sm text-muted-foreground font-medium">
                              No detections recorded yet
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Start monitoring to see events appear here
                            </p>
                          </>
                        ) : (
                          <>
                            <Filter className="h-12 w-12 text-muted-foreground/50 mb-3" />
                            <p className="text-sm text-muted-foreground font-medium">
                              No results found
                            </p>
                            <p className="text-xs text-muted-foreground mt-1">
                              Try adjusting your filters
                            </p>
                            <Button
                              variant="link"
                              size="sm"
                              onClick={clearFilters}
                              className="mt-2"
                            >
                              Clear filters
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredLogs.map((log) => (
                    <TableRow 
                      key={log._id}
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <TableCell className="font-mono text-xs text-muted-foreground">
                        {log._id}
                      </TableCell>
                      <TableCell className="font-medium">
                        {new Date(log.timestamp).toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <span className="font-mono font-semibold">
                          {log.distance} cm
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant={getDistanceBadge(log.distance)}>
                          {getDistanceLabel(log.distance)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {filteredLogs.length > 0 && (
            <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
              <div>
                Showing {filteredLogs.length} of {stats.total} {stats.total === 1 ? 'record' : 'records'}
              </div>
              {distanceFilter !== "all" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={clearFilters}
                  className="h-7 text-xs"
                >
                  Clear all filters
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}