import { Link, useLocation } from "react-router-dom";
import { Search, MessageSquare, BarChart3, Database } from "lucide-react";

const navItems = [
  { path: "/", label: "Search", icon: Search },
  { path: "/chat", label: "Chat", icon: MessageSquare },
  { path: "/analytics", label: "Analytics", icon: BarChart3 },
];
import { User } from "lucide-react";

export function Header() {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
<User className="w-6 h-6 text-foreground" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground leading-tight">User</h1>
              <p className="text-xs text-muted-foreground">Spatiotemporal Retrieval System</p>
            </div>
          </Link>

          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center gap-2 ${isActive ? "nav-link-active" : ""}`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="hidden md:inline px-2 py-1 bg-muted rounded-md font-mono">
              21,000 articles indexed
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
