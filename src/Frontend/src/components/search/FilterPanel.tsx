import { useState } from "react";
import { Calendar, MapPin, ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface FilterPanelProps {
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  dateFrom: string;
  dateTo: string;
  location: string;
  semanticSearch: boolean;
}

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    dateFrom: "",
    dateTo: "",
    location: "",
    semanticSearch: true,
  });

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = { dateFrom: "", dateTo: "", location: "", semanticSearch: true };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
      >
        <span className="font-medium text-sm">Filters</span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </button>

      {isExpanded && (
        <div className="animate-fade-in">
          <div className="filter-section">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Date Range
            </label>
            <div className="space-y-2">
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => updateFilter("dateFrom", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                placeholder="From"
              />
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => updateFilter("dateTo", e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                placeholder="To"
              />
            </div>
          </div>

          <div className="filter-section">
            <label className="flex items-center gap-2 text-sm font-medium text-foreground mb-3">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Location
            </label>
            <input
              type="text"
              value={filters.location}
              onChange={(e) => updateFilter("location", e.target.value)}
              placeholder="Country or city…"
              className="w-full px-3 py-2 text-sm bg-background border border-border rounded-lg focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>

          <div className="filter-section">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-foreground">
                <Sparkles className="w-4 h-4 text-muted-foreground" />
                Semantic + Keyword
              </label>
              <Switch
                checked={filters.semanticSearch}
                onCheckedChange={(checked) => updateFilter("semanticSearch", checked)}
              />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Combines meaning-based and exact-match search
            </p>
          </div>

          <div className="p-4">
            <Button variant="outline" size="sm" onClick={clearFilters} className="w-full">
              Clear All Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
