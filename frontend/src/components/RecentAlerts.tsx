import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, MapPin, Clock, TrendingUp } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

type Alert = {
  id: number
  type: "critical" | "warning" | "info"
  title: string
  location: string
  time: string
  value: string
  description: string
}

export const RecentAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true)
        const res = await fetch("http://localhost:3000/api/v1/calculate/alert")
        const data = await res.json()
        setAlerts(data)
      } catch (err) {
        console.error("Error fetching alerts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAlerts()
    const interval = setInterval(fetchAlerts, 10000) // refresh every 10s
    return () => clearInterval(interval)
  }, [])

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "critical":
        return <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>
      case "warning":
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>
      case "info":
        return <Badge variant="outline" className="border-accent text-accent">Info</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-4 h-4 text-destructive" />
      case "warning":
        return <TrendingUp className="w-4 h-4 text-warning" />
      default:
        return <AlertTriangle className="w-4 h-4 text-accent" />
    }
  }

  return (
    <Card className="shadow-data">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-foreground">Recent Alerts</CardTitle>
          <Badge variant="outline" className="text-xs">
            {loading ? <Skeleton className="h-4 w-6" /> : `${alerts.length} Active`}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">
          Latest pollution monitoring alerts and warnings
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        {loading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 animate-pulse"
              >
                <Skeleton className="w-4 h-4 mt-1" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-3 w-full" />
                </div>
              </div>
            ))
          : alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {getAlertBadge(alert.type)}
                    <span className="text-sm font-medium text-foreground">{alert.title}</span>
                  </div>

                  <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{alert.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{alert.time}</span>
                    </div>
                  </div>

                  <p className="text-sm text-foreground font-medium mb-1">{alert.value}</p>
                  <p className="text-xs text-muted-foreground">{alert.description}</p>
                </div>
              </div>
            ))}
      </CardContent>
    </Card>
  )
}
