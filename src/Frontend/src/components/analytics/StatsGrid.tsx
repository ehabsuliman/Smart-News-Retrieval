import { FileText, MapPin, Clock, Tag } from "lucide-react";

const stats = [
  {
    label: "Total Documents",
    value: "21,578",
    icon: FileText,
    change: "Reuters 1996-1997",
  },
  {
    label: "Unique Locations",
    value: "1,247",
    icon: MapPin,
    change: "Countries & cities",
  },
  {
    label: "Temporal Expressions",
    value: "45,892",
    icon: Clock,
    change: "Dates & periods",
  },
  {
    label: "Topic Categories",
    value: "156",
    icon: Tag,
    change: "Auto-classified",
  },
];

export function StatsGrid() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div key={stat.label} className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            <p className="text-sm font-medium text-foreground mt-1">{stat.label}</p>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </div>
        );
      })}
    </div>
  );
}
