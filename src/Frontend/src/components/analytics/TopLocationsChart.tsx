import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { location: "United States", count: 4523 },
  { location: "United Kingdom", count: 2890 },
  { location: "Germany", count: 2156 },
  { location: "Japan", count: 1987 },
  { location: "France", count: 1654 },
  { location: "China", count: 1432 },
  { location: "Russia", count: 1298 },
  { location: "Brazil", count: 987 },
];

export function TopLocationsChart() {
  return (
    <div className="stat-card">
      <h3 className="font-semibold mb-1">Top Mentioned Locations</h3>
      <p className="text-sm text-muted-foreground mb-6">Geographic distribution of news coverage</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={mockData} layout="vertical" margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
            <XAxis 
              type="number"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }}
            />
            <YAxis 
              type="category"
              dataKey="location"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(210, 20%, 88%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Bar 
              dataKey="count" 
              fill="hsl(200, 70%, 50%)" 
              radius={[0, 4, 4, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
