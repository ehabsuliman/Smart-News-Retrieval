import { Clock } from "lucide-react";

const expressions = [
  { expression: "yesterday", count: 3456 },
  { expression: "last week", count: 2890 },
  { expression: "Monday", count: 2567 },
  { expression: "this year", count: 2345 },
  { expression: "next month", count: 1987 },
  { expression: "1997", count: 1765 },
  { expression: "January", count: 1543 },
  { expression: "last year", count: 1234 },
];

export function TemporalExpressions() {
  const maxCount = Math.max(...expressions.map((e) => e.count));

  return (
    <div className="stat-card">
      <h3 className="font-semibold mb-1">Frequent Temporal Expressions</h3>
      <p className="text-sm text-muted-foreground mb-6">Most common time references</p>
      <div className="grid grid-cols-2 gap-3">
        {expressions.map((item) => (
          <div
            key={item.expression}
            className="flex items-center gap-2 p-2 rounded-lg bg-muted/50"
          >
            <Clock className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{item.expression}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary/50 rounded-full"
                    style={{ width: `${(item.count / maxCount) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-muted-foreground shrink-0">
                  {item.count.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
