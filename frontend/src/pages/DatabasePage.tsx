import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Server } from "lucide-react"

export const DatabasePage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Database Management</h1>
        <p className="text-muted-foreground mt-1">
          Manage monitoring data and system configurations
        </p>
      </div>

      <Card className="shadow-data min-h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Database className="w-5 h-5 text-secondary" />
            <span>Data Management Interface</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-subtle rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center space-y-2">
              <Server className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Database management interface coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}