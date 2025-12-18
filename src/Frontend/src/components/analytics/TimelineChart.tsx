import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const mockData = [
  { date: "Jan 1997", count: 1245 },
  { date: "Feb 1997", count: 1389 },
  { date: "Mar 1997", count: 1567 },
  { date: "Apr 1997", count: 1234 },
  { date: "May 1997", count: 1890 },
  { date: "Jun 1997", count: 2100 },
  { date: "Jul 1997", count: 1950 },
  { date: "Aug 1997", count: 2234 },
  { date: "Sep 1997", count: 2456 },
  { date: "Oct 1997", count: 2123 },
  { date: "Nov 1997", count: 1987 },
  { date: "Dec 1997", count: 1756 },
];

export function TimelineChart() {
  return (
    <div className="stat-card">
      <h3 className="font-semibold mb-1">Document Distribution Over Time</h3>
      <p className="text-sm text-muted-foreground mb-6">Daily aggregation of indexed articles</p>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mockData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(215, 60%, 45%)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(215, 60%, 45%)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }}
            />
            <YAxis 
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "hsl(215, 15%, 50%)" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(0, 0%, 100%)",
                border: "1px solid hsl(210, 20%, 88%)",
                borderRadius: "8px",
                fontSize: "12px",
              }}
            />
            <Area
              type="monotone"
              dataKey="count"
              stroke="hsl(215, 60%, 45%)"
              strokeWidth={2}
              fill="url(#colorCount)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
