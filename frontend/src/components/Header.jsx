import { NavLink } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Shield, Activity, Database, Zap } from "lucide-react"

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between">
        <NavLink to="/" className="flex items-center gap-3 group">
          <div className="relative">
            <Shield className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
            <div className="absolute -inset-1 bg-primary/20 rounded-full blur-sm opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <span className="font-bold text-lg bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              SecureHome
            </span>
            <span className="block text-xs text-muted-foreground -mt-1">
              Motion Monitoring System
            </span>
          </div>
        </NavLink>

        <nav className="flex items-center gap-2">
          <NavLink to="/">
            {({ isActive }) => (
              <Button 
                variant={isActive ? "default" : "ghost"}
                className="gap-2"
              >
                <Activity className="h-4 w-4" />
                Live Feed
                {isActive && (
                  <span className="ml-1 h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                )}
              </Button>
            )}
          </NavLink>

          <NavLink to="/database">
            {({ isActive }) => (
              <Button 
                variant={isActive ? "default" : "ghost"}
                className="gap-2"
              >
                <Database className="h-4 w-4" />
                Database
              </Button>
            )}
          </NavLink>

          <div className="ml-2 pl-2 border-l">
            <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-muted/50">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span className="text-xs font-medium text-muted-foreground">
                System Online
              </span>
            </div>
          </div>
        </nav>
      </div>
    </header>
  )
}