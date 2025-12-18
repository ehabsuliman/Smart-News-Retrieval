import { MapPin, Clock, Lightbulb, FileText, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface SearchResult {
  id: string;
  title: string;
  date: string;
  snippet: string;
  relevanceScore: number;
  places: string[];
  temporalExpressions: string[];
}

interface ResultCardProps {
  result: SearchResult;
  index: number;
  onExplain: (result: SearchResult) => void;
  onSummarize: (result: SearchResult) => void;
  onAsk: (result: SearchResult) => void;
}

export function ResultCard({ result, index, onExplain, onSummarize, onAsk }: ResultCardProps) {
  const getRelevanceColor = (score: number) => {
    if (score >= 0.8) return "bg-relevance-high";
    if (score >= 0.5) return "bg-relevance-medium";
    return "bg-relevance-low";
  };

  return (
    <article 
      className="result-card animate-slide-up"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-foreground leading-snug line-clamp-2 mb-1">
            {result.title}
          </h3>
          <time className="text-xs text-muted-foreground">{result.date}</time>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="text-xs text-muted-foreground">Relevance</span>
          <div className="w-16 relevance-bar">
            <div
              className={`h-full ${getRelevanceColor(result.relevanceScore)} transition-all`}
              style={{ width: `${result.relevanceScore * 100}%` }}
            />
          </div>
        </div>
      </div>

      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-3">
        {result.snippet}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {result.places.map((place, i) => (
          <span key={i} className="chip-geo flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {place}
          </span>
        ))}
        {result.temporalExpressions.map((expr, i) => (
          <span key={i} className="chip-time flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {expr}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2 pt-3 border-t border-border">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onExplain(result)}
          className="text-xs"
        >
          <Lightbulb className="w-3.5 h-3.5 mr-1.5" />
          Explain
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onSummarize(result)}
          className="text-xs"
        >
          <FileText className="w-3.5 h-3.5 mr-1.5" />
          Summarize
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onAsk(result)}
          className="text-xs"
        >
          <MessageCircle className="w-3.5 h-3.5 mr-1.5" />
          Ask
        </Button>
      </div>
    </article>
  );
}
