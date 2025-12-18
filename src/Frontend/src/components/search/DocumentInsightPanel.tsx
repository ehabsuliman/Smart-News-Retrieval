import { X, MapPin, Clock, FileText, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchResult } from "./ResultCard";

interface DocumentInsightPanelProps {
  result: SearchResult | null;
  mode: "explain" | "summarize" | null;
  onClose: () => void;
}

export function DocumentInsightPanel({ result, mode, onClose }: DocumentInsightPanelProps) {
  if (!result || !mode) return null;

  // Mock AI-generated content
  const mockSummary = `This Reuters article reports on significant developments in ${result.places[0] || "the region"}, highlighting key events that occurred ${result.temporalExpressions[0] || "during this period"}. The report emphasizes the geopolitical implications and provides context from multiple stakeholders involved in the situation.`;

  const mockExplanation = `This document was ranked highly because it contains strong semantic matches for your query terms, particularly in relation to the geographic and temporal context specified. The document's focus on ${result.places[0] || "regional events"} aligns with your search parameters.`;

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-md bg-card border-l border-border shadow-xl z-50 animate-slide-in-right">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            {mode === "explain" ? (
              <Lightbulb className="w-5 h-5 text-primary" />
            ) : (
              <FileText className="w-5 h-5 text-primary" />
            )}
            <h2 className="font-semibold">
              {mode === "explain" ? "Relevance Explanation" : "Document Summary"}
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Document Header */}
          <div className="pb-4 border-b border-border">
            <h3 className="font-semibold text-lg leading-snug mb-2">{result.title}</h3>
            <p className="text-sm text-muted-foreground">{result.date}</p>
          </div>

          {/* AI Generated Content */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
              <span className="w-2 h-2 bg-primary rounded-full" />
              {mode === "explain" ? "Why This Result?" : "AI Summary"}
            </h4>
            <p className="text-sm text-foreground leading-relaxed">
              {mode === "explain" ? mockExplanation : mockSummary}
            </p>
          </div>

          {/* Extracted Entities */}
          <div>
            <h4 className="text-sm font-medium mb-3">Extracted Information</h4>
            
            <div className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                  <MapPin className="w-3 h-3" />
                  Geographic References
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.places.length > 0 ? (
                    result.places.map((place, i) => (
                      <span key={i} className="chip-geo">{place}</span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">None detected</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  Temporal Expressions
                </p>
                <div className="flex flex-wrap gap-2">
                  {result.temporalExpressions.length > 0 ? (
                    result.temporalExpressions.map((expr, i) => (
                      <span key={i} className="chip-time">{expr}</span>
                    ))
                  ) : (
                    <span className="text-sm text-muted-foreground">None detected</span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Citation */}
          <div className="bg-surface-sunken rounded-lg p-4">
            <p className="text-xs text-muted-foreground mb-1">Citation</p>
            <p className="text-sm font-mono">
              Reuters. "{result.title}". {result.date}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
