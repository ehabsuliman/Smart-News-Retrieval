import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Header } from "@/components/layout/Header";
import { ChatInterface } from "@/components/chat/ChatInterface";
import { RecentDocuments } from "@/components/chat/RecentDocuments";
import { api } from "@/lib/api";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";

function generateSessionId() {
  return `sess_${Math.random().toString(36).substring(2, 10)}`;
}

export default function Chat() {
  const [searchParams] = useSearchParams();
  const [sessionId, setSessionId] = useState(generateSessionId);
  const [backendStatus, setBackendStatus] = useState<"checking" | "connected" | "disconnected">("checking");
  
  const initialQuery = searchParams.get("q") || undefined;

  useEffect(() => {
    checkBackendHealth();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const health = await api.healthCheck();
      setBackendStatus(health.status === "healthy" ? "connected" : "disconnected");
    } catch {
      setBackendStatus("disconnected");
    }
  };

  const handleNewSession = () => {
    setSessionId(generateSessionId());
  };

  const handleClearSession = () => {
    // Session cleared in ChatInterface
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      {/* Backend Status Banner */}
      {backendStatus !== "connected" && (
        <div className={`px-4 py-2 text-sm flex items-center justify-center gap-2 ${
          backendStatus === "checking" 
            ? "bg-muted text-muted-foreground" 
            : "bg-destructive/10 text-destructive"
        }`}>
          {backendStatus === "checking" ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Connecting to backend...
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4" />
              Backend unavailable. Make sure the API server is running on localhost:8000
            </>
          )}
        </div>
      )}

      <div className="flex-1 container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-8rem)]">
          {/* Recent Documents - Left Sidebar */}
          <aside className="hidden lg:block">
            <RecentDocuments />
          </aside>

          {/* Main Chat Area */}
          <div className="lg:col-span-3 bg-card border border-border rounded-xl overflow-hidden">
            <ChatInterface
              sessionId={sessionId}
              onNewSession={handleNewSession}
              onClearSession={handleClearSession}
              initialQuery={initialQuery}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
