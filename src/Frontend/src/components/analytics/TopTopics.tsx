const topics = [
  { name: "Politics", count: 5234, percentage: 24 },
  { name: "Economics", count: 4567, percentage: 21 },
  { name: "International Relations", count: 3890, percentage: 18 },
  { name: "Business", count: 3456, percentage: 16 },
  { name: "Finance", count: 2345, percentage: 11 },
  { name: "Sports", count: 1234, percentage: 6 },
  { name: "Technology", count: 852, percentage: 4 },
];

export function TopTopics() {
  return (
    <div className="stat-card">
      <h3 className="font-semibold mb-1">Most Referenced Topics</h3>
      <p className="text-sm text-muted-foreground mb-6">Classification by subject matter</p>
      <div className="space-y-4">
        {topics.map((topic) => (
          <div key={topic.name}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium">{topic.name}</span>
              <span className="text-muted-foreground">{topic.count.toLocaleString()}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/70 rounded-full transition-all"
                style={{ width: `${topic.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
