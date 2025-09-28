import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, CheckCircle, Filter, Bell } from "lucide-react"

interface Alert {
  id: string
  type: string
  title: string
  location: string
  time: string
  value: string
  description: string
}

interface CountData {
  criticalSites: number
  highRiskSites: number
  moderateSites: number
  lowRiskSites: number
}

export const AlertsPage = () => {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [counts, setCounts] = useState<CountData>({
    criticalSites: 0,
    highRiskSites: 0,
    moderateSites: 0,
    lowRiskSites: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [alertsRes, countsRes] = await Promise.all([
          fetch("http://localhost:3000/api/v1/calculate/alert"),
          fetch("http://localhost:3000/api/v1/calculate/count"),
        ])

        if (!alertsRes.ok || !countsRes.ok) {
          throw new Error("API request failed")
        }

        const alertsData: Alert[] = await alertsRes.json()
        const countsData: CountData = await countsRes.json()

        setAlerts(alertsData)
        setCounts(countsData)
      } catch (err) {
        console.error("Failed to fetch alerts:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const getAlertBadge = (type: string) => {
    switch (type) {
      case "critical":
        return <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>
      case "warning":
        return <Badge className="bg-warning text-warning-foreground">Warning</Badge>
      case "resolved":
        return <Badge className="bg-success text-success-foreground">Resolved</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="w-5 h-5 text-destructive" />
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-warning" />
      case "resolved":
        return <CheckCircle className="w-5 h-5 text-success" />
      default:
        return <AlertTriangle className="w-5 h-5 text-muted-foreground" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>

        {/* Skeleton Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="shadow-data">
              <CardContent className="p-4">
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-8 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Skeleton Alerts */}
        <Card className="shadow-data">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-start space-x-4 p-4 rounded-lg border border-border"
              >
                <Skeleton className="h-6 w-6 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-64" />
                  <div className="flex space-x-4">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-3 w-10" />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Alerts & Notifications</h1>
          <p className="text-muted-foreground mt-1">
            Monitor critical pollution levels and system alerts
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="shadow-data border-l-4 border-l-destructive">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Critical Alerts</p>
                <p className="text-2xl font-bold text-destructive">{counts.criticalSites}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-destructive" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-data border-l-4 border-l-warning">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">High Risk Sites</p>
                <p className="text-2xl font-bold text-warning">{counts.highRiskSites}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-warning" />
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-data border-l-4 border-l-success">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Moderate Sites</p>
                <p className="text-2xl font-bold text-success">{counts.moderateSites}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-success" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert List */}
      <Card className="shadow-data">
        <CardHeader>
          <CardTitle>Recent Alerts</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {alerts.length === 0 ? (
            <p className="text-muted-foreground text-sm">No alerts available</p>
          ) : (
            alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-4 p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="mt-1">{getAlertIcon(alert.type)}</div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    {getAlertBadge(alert.type)}
                    <span className="text-sm font-medium text-foreground">{alert.title}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{alert.description}</p>
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span>📍 {alert.location}</span>
                    <span>🕒 {alert.time}</span>
                    <span className="font-medium">{alert.value}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  )
}
