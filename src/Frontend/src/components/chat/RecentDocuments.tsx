import { FileText, Clock } from "lucide-react";

interface RecentDocument {
  id: string;
  title: string;
  date: string;
  mentionedAt: string;
}

const mockRecentDocs: RecentDocument[] = [
  {
    id: "1",
    title: "Regional tensions escalate amid diplomatic efforts",
    date: "March 15, 1997",
    mentionedAt: "2 min ago",
  },
  {
    id: "2",
    title: "Economic implications of ongoing negotiations",
    date: "March 18, 1997",
    mentionedAt: "5 min ago",
  },
  {
    id: "3",
    title: "International response to regional developments",
    date: "March 20, 1997",
    mentionedAt: "8 min ago",
  },
];

export function RecentDocuments() {
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden h-full">
      <div className="p-4 border-b border-border">
        <h3 className="font-semibold text-sm">Recently Discussed</h3>
      </div>
      <div className="p-2">
        {mockRecentDocs.map((doc) => (
          <button
            key={doc.id}
            className="w-full text-left p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground line-clamp-2 leading-snug">
                  {doc.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span>{doc.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {doc.mentionedAt}
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
