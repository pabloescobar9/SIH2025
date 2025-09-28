import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

const data = [
  { time: "00:00", HPI: 82, HEI: 38, CF: 142, PLI: 0.68 },
  { time: "04:00", HPI: 85, HEI: 41, CF: 148, PLI: 0.71 },
  { time: "08:00", HPI: 89, HEI: 43, CF: 152, PLI: 0.73 },
  { time: "12:00", HPI: 87, HEI: 42, CF: 156, PLI: 0.73 },
  { time: "16:00", HPI: 91, HEI: 45, CF: 159, PLI: 0.75 },
  { time: "20:00", HPI: 87, HEI: 43, CF: 156, PLI: 0.73 },
];

export const PollutionChart = () => {
  return (
    <Card className="shadow-data">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground">
          Pollution Trends - Last 24 Hours
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Real-time monitoring of heavy metal pollution indices
        </p>
      </CardHeader>
      <CardContent>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis 
                dataKey="time" 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }}
                tickLine={{ stroke: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-data)'
                }}
              />
              <ReferenceLine y={100} stroke="hsl(var(--destructive))" strokeDasharray="5 5" />
              
              <Line 
                type="monotone" 
                dataKey="HPI" 
                stroke="hsl(var(--primary))" 
                strokeWidth={3}
                dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
              />
              <Line 
                type="monotone" 
                dataKey="CF" 
                stroke="hsl(var(--destructive))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--destructive))', strokeWidth: 2, r: 3 }}
              />
              <Line 
                type="monotone" 
                dataKey="HEI" 
                stroke="hsl(var(--success))" 
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--success))', strokeWidth: 2, r: 3 }}
              />
              <Line
                type="monotone"
                dataKey="PLI"
                stroke="hsl(var(--accent))"
                strokeWidth={2}
                dot={{ fill: 'hsl(var(--accent))', r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t border-border">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-primary"></div>
            <span className="text-sm text-muted-foreground">HPI (Heavy Metal Pollution)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-destructive"></div>
            <span className="text-sm text-muted-foreground">CF (Contamination Factor)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-success"></div>
            <span className="text-sm text-muted-foreground">HEI (Heavy Metal Evaluation)</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded bg-accent"></div>
            <span className="text-sm text-muted-foreground">PLI (Pollution Load Index)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
