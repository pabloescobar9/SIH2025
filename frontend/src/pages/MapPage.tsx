import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { MapPin, Filter, Download, RefreshCw, Calendar } from "lucide-react"
import { ContaminationMap } from "@/components/ContaminationMap"

export const MapPage = () => {
  const [filters, setFilters] = useState({
    dateRange: "all",
    metalType: "all",
    contamination: "all"
  })

  const [isRefreshing, setIsRefreshing] = useState(false)
  const [monitoringSites, setMonitoringSites] = useState<any[]>([])
  const [stats, setStats] = useState({
    criticalSites: 0,
    highRiskSites: 0,
    moderateSites: 0,
    lowRiskSites: 0
  })
  const [alerts, setAlerts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch data from APIs
  const fetchData = async () => {
    try {
      const [sitesRes, countRes, alertRes] = await Promise.all([
        fetch("http://localhost:3000/api/v1/calculate"),
        fetch("http://localhost:3000/api/v1/calculate/count"),
        fetch("http://localhost:3000/api/v1/calculate/alert")
      ])

      const sitesData = await sitesRes.json()
      const countData = await countRes.json()
      const alertData = await alertRes.json()

      setMonitoringSites(sitesData)
      setStats(countData)
      setAlerts(alertData)
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleRefresh = async () => {
    setIsRefreshing(true)
    await fetchData()
    setIsRefreshing(false)
  }

  const getStatusBadge = (hpi: number) => {
    if (hpi > 100) return <Badge className="bg-destructive text-destructive-foreground">Critical</Badge>
    if (hpi > 80) return <Badge className="bg-orange-500 text-white">High Risk</Badge>
    if (hpi > 40) return <Badge className="bg-yellow-500 text-white">Moderate</Badge>
    return <Badge className="bg-success text-success-foreground">Low Risk</Badge>
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex space-x-2 mt-4 lg:mt-0">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-20 rounded-md" />
          </div>
        </div>

        {/* Stats Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="shadow-data">
              <CardContent className="p-4">
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-6 w-12" />
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Map Skeleton */}
        <Card className="shadow-data">
          <CardHeader>
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[300px] w-full rounded-lg" />
          </CardContent>
        </Card>

        {/* Monitoring Sites Skeleton */}
        <Card className="shadow-data">
          <CardHeader>
            <Skeleton className="h-6 w-40" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-4 rounded-lg border border-border"
              >
                <div className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex items-center space-x-6">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
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
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Contamination Map</h1>
          <p className="text-muted-foreground mt-1">
            Geographic visualization of heavy metal contamination across monitoring sites
          </p>
        </div>
        <div className="flex items-center space-x-2 mt-4 lg:mt-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="shadow-data border-l-4 border-l-destructive">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Critical Sites</p>
              <p className="text-2xl font-bold text-destructive">{stats.criticalSites}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-destructive"></div>
          </CardContent>
        </Card>

        <Card className="shadow-data border-l-4 border-l-orange-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">High Risk</p>
              <p className="text-2xl font-bold text-orange-600">{stats.highRiskSites}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
          </CardContent>
        </Card>

        <Card className="shadow-data border-l-4 border-l-yellow-500">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Moderate</p>
              <p className="text-2xl font-bold text-yellow-600">{stats.moderateSites}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          </CardContent>
        </Card>

        <Card className="shadow-data border-l-4 border-l-success">
          <CardContent className="p-4 flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Risk</p>
              <p className="text-2xl font-bold text-success">{stats.lowRiskSites}</p>
            </div>
            <div className="w-3 h-3 rounded-full bg-success"></div>
          </CardContent>
        </Card>
      </div>

      {/* Interactive Map */}
      <Card className="shadow-data">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>Interactive Contamination Map</span>
            </CardTitle>
            <Badge variant="outline" className="bg-success/10 text-success border-success">
              <div className="w-2 h-2 rounded-full bg-success mr-1"></div>
              {monitoringSites.length} Sites Active
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Click on monitoring site markers to view detailed contamination data and pollution indices
          </p>
        </CardHeader>
        <CardContent>
          <ContaminationMap sites={monitoringSites} selectedFilters={filters} />
        </CardContent>
      </Card>

      {/* Monitoring Sites Overview */}
      <Card className="shadow-data">
        <CardHeader>
          <CardTitle>Monitoring Sites Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {monitoringSites.map((site) => (
              <div
                key={site.id}
                className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="font-medium text-foreground">{site.name}</span>
                  </div>
                  {getStatusBadge(Number(site.hpi))}
                </div>

                <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                  <div>HPI: <span className="font-medium text-foreground">{site.hpi}</span></div>
                  <div>CF: <span className="font-medium text-foreground">{site.cf}</span></div>
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{site.lastSample}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
