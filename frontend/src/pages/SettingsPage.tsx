import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Cog } from "lucide-react"

export const SettingsPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground mt-1">
          Configure system parameters and monitoring thresholds
        </p>
      </div>

      <Card className="shadow-data min-h-[400px]">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Settings className="w-5 h-5 text-accent" />
            <span>System Configuration</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gradient-subtle rounded-lg h-64 flex items-center justify-center border-2 border-dashed border-border">
            <div className="text-center space-y-2">
              <Cog className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Settings configuration coming soon</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}