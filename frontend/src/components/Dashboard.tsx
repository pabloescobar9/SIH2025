import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  CheckCircle,
  Droplets,
  Activity,
  MapPin,
  Clock,
  AlertTriangle,
} from "lucide-react"
import { PollutionChart } from "@/components/PollutionChart"
import { RecentAlerts } from "@/components/RecentAlerts"

export const Dashboard = () => {
  const [status, setStatus] = useState({
    activeMonitoringSites: 0,
    samplesToday: 0,
    systemUptime: "0h 0m"
  })

  const [counts, setCounts] = useState({
    criticalSites: 0,
    highRiskSites: 0,
    moderateSites: 0,
    lowRiskSites: 0
  })

  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      const [statusRes, countRes] = await Promise.all([
        fetch("http://localhost:3000/api/v1/calculate/status"),
        fetch("http://localhost:3000/api/v1/calculate/count")
      ])

      const statusData = await statusRes.json()
      const countData = await countRes.json()

      setStatus(statusData)
      setCounts(countData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const quickStats = [
    { label: "Active Monitoring Sites", value: status.activeMonitoringSites, icon: MapPin },
    { label: "Samples Today", value: status.samplesToday, icon: Droplets },
    { label: "System Uptime", value: status.systemUptime, icon: Activity },
    { label: "Last Update", value: new Date().toLocaleTimeString(), icon: Clock },
  ]

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Skeleton className="h-8 w-72 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Skeleton className="h-6 w-48 rounded-md" />
          </div>
        </div>

        {/* Quick Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-data">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Risk Counts Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="shadow-data">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <Skeleton className="h-4 w-20 mb-2" />
                  <Skeleton className="h-6 w-12" />
                </div>
                <Skeleton className="h-6 w-6 rounded-full" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts & Alerts Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
          <div>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Groundwater Monitoring Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Real-time heavy metal pollution monitoring and analysis
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 sm:mt-0">
          <Badge variant="outline" className="bg-success/10 text-success border-success">
            <CheckCircle className="w-3 h-3 mr-1" />
            All Systems Operational
          </Badge>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="shadow-data">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <stat.icon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{stat.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Risk Counts */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-data border-l-4 border-l-destructive">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical Sites</p>
              <p className="text-2xl font-bold text-destructive">{counts.criticalSites}</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-destructive" />
          </CardContent>
        </Card>

        <Card className="shadow-data border-l-4 border-l-orange-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Risk</p>
              <p className="text-2xl font-bold text-orange-600">{counts.highRiskSites}</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-orange-500" />
          </CardContent>
        </Card>

        <Card className="shadow-data border-l-4 border-l-yellow-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Moderate</p>
              <p className="text-2xl font-bold text-yellow-600">{counts.moderateSites}</p>
            </div>
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
          </CardContent>
        </Card>

        <Card className="shadow-data border-l-4 border-l-success">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Risk</p>
              <p className="text-2xl font-bold text-success">{counts.lowRiskSites}</p>
            </div>
            <CheckCircle className="w-5 h-5 text-success" />
          </CardContent>
        </Card>
      </div>

      {/* Charts and Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PollutionChart />
        </div>
        <div>
          <RecentAlerts />
        </div>
      </div>
    </div>
  )
}
