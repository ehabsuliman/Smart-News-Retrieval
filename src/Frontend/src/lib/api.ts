// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Types matching backend Pydantic models
export interface AutocompleteRequest {
  query: string;
  top_k?: number;
}

export interface AutocompleteResponse {
  query: string;
  results: string[];
}

export interface SearchRequest {
  query: string;
  top_k?: number;
}

export interface SearchDocument {
  id: string;
  score: number;
  relevanceScore: number; 
  title: string;
  content: string;
  date: string;
  dateline: string;
  authors: string[];
  places: string[];
  topics: string[];
  people: string[];
  orgs: string[];
  companies: string[];
  exchanges: string[];
  temporalExpressions: string[];
  georeferences: string[];
  geopoints: string[];
  geo_location: { lat: number; lon: number } | null;
}

export interface SearchResponse {
  query: string;
  total: number;
  documents: SearchDocument[];
}

export interface ChatRequest {
  query: string;
  session_id: string;
  use_memory?: boolean;
}

export interface ChatResponse {
  answer: string;
  session_id: string;
  query_rewritten: string | null;
  documents_used: string[];
}

export interface HealthResponse {
  status: "healthy" | "unhealthy";
  elasticsearch: "connected" | "disconnected";
}

class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: "Unknown error" }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Autocomplete endpoint for search suggestions
  async autocomplete(query: string, topK: number = 5): Promise<AutocompleteResponse> {
    return this.request<AutocompleteResponse>("/autocomplete", {
      method: "POST",
      body: JSON.stringify({ query, top_k: topK }),
    });
  }

  // Search endpoint returning full document details
  async search(query: string, topK: number = 10): Promise<SearchResponse> {
    return this.request<SearchResponse>("/search", {
      method: "POST",
      body: JSON.stringify({ query, top_k: topK }),
    });
  }

  // Chat endpoint with memory and context
  async chat(
    query: string,
    sessionId: string,
    useMemory: boolean = true
  ): Promise<ChatResponse> {
    return this.request<ChatResponse>("/chat", {
      method: "POST",
      body: JSON.stringify({
        query,
        session_id: sessionId,
        use_memory: useMemory,
      }),
    });
  }

  // Clear conversation history for a session
  async clearSession(sessionId: string): Promise<{ message: string }> {
    return this.request<{ message: string }>(`/clear_session/${sessionId}`, {
      method: "DELETE",
    });
  }

  // Health check
  async healthCheck(): Promise<HealthResponse> {
    return this.request<HealthResponse>("/health");
  }
}

export const api = new ApiService();
