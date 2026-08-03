import { Link, useRouter } from "@tanstack/react-router";
import { LogOut, Sparkles, BookOpen, Trophy, GraduationCap, ShieldAlert, History, Menu, X, User, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { EldenRingToggle } from "@/components/elden-ring-toggle";
import { AvatarBadge } from "@/components/avatar-badge";
import { ProfileModal } from "@/components/profile-modal";
import { PWAInstallModal } from "@/components/pwa-install-modal";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile } from "@/lib/quiz.functions";
import { getMyRole } from "@/lib/admin.functions";
import { signOutFn } from "@/lib/auth.functions";
import { useState } from "react";
import { toast } from "sonner";

export function AppHeader() {
  const { userId: user } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [pwaModalOpen, setPwaModalOpen] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const meFn = useServerFn(getMyProfile);
  const roleFn = useServerFn(getMyRole);
  const signOutAction = useServerFn(signOutFn);

  const { data: profile } = useQuery({
    queryKey: ["me"],
    queryFn: () => meFn(),
    enabled: !!user,
  });

  const { data: roleInfo } = useQuery({
    queryKey: ["myRole"],
    queryFn: () => roleFn(),
    enabled: !!user,
  });

  const navLinks = [
    { to: "/dashboard", label: "Dashboard", icon: Sparkles },
    { to: "/learn", label: "Learn", icon: GraduationCap },
    { to: "/leaderboard", label: "Leaderboard", icon: Trophy },
    { to: "/history", label: "History", icon: History },
    ...(roleInfo?.isAdmin ? [{ to: "/admin", label: "Admin", icon: ShieldAlert }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 gap-4">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2 font-display text-lg font-bold shrink-0">
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground shadow-sm">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="hidden sm:block">QuizForge</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                activeOptions={{ exact: to === "/dashboard" }}
                activeProps={{ className: "bg-primary/10 text-primary font-semibold" }}
                inactiveProps={{ className: "text-muted-foreground hover:text-foreground hover:bg-muted/60" }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-all"
              >
                <Icon className="w-3.5 h-3.5" />
                {label}
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="ghost"
              size="icon"
              title="Install QuizForge PWA App"
              onClick={() => {
                if ('serviceWorker' in navigator && (window as any).deferredPwaPrompt) {
                  (window as any).deferredPwaPrompt.prompt();
                } else {
                  setPwaModalOpen(true);
                }
              }}
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
            >
              <Download className="h-4 w-4" />
            </Button>
            <ThemeToggle />
            <EldenRingToggle />
            {user && (
              <>
                {/* Avatar badge button -> opens profile modal */}
                <button
                  type="button"
                  onClick={() => setProfileModalOpen(true)}
                  className="hidden sm:flex items-center gap-2 p-1 rounded-xl hover:bg-muted/60 transition-colors cursor-pointer"
                  title="Profile & Avatar Settings"
                >
                  <AvatarBadge
                    avatarId={(profile as any)?.avatar_preset || null}
                    size="sm"
                    className="hover:scale-105 transition-transform"
                  />
                </button>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Sign out"
                  disabled={signingOut}
                  onClick={async () => {
                    setSigningOut(true);
                    try {
                      await signOutAction();
                      toast.success("Signed out");
                    } finally {
                      // Full reload guarantees every cached query and auth
                      // context resets clean, no stale "still logged in" UI.
                      window.location.href = "/auth";
                    }
                  }}
                  className="h-8 w-8"
                >
                  <LogOut className="h-4 w-4" />
                </Button>
                {/* Mobile menu toggle */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="md:hidden h-8 w-8"
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  aria-label="Toggle menu"
                >
                  {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile drawer */}
        {mobileMenuOpen && user && (
          <div className="md:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-in slide-in-from-top-2 duration-200">
            <nav className="px-4 py-3 space-y-1">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  setProfileModalOpen(true);
                }}
                className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-muted/60 transition-colors w-full text-foreground font-medium"
              >
                <User className="w-4 h-4 text-primary" />
                Profile & Avatar Settings
              </button>
              {navLinks.map(({ to, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  activeOptions={{ exact: to === "/dashboard" }}
                  activeProps={{ className: "bg-primary/10 text-primary font-semibold" }}
                  inactiveProps={{ className: "text-muted-foreground" }}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-xl hover:bg-muted/60 transition-colors w-full"
                >
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>

      {/* Profile & Avatar Settings Modal */}
      <ProfileModal isOpen={profileModalOpen} onClose={() => setProfileModalOpen(false)} />
      {/* PWA Installation Modal */}
      <PWAInstallModal isOpen={pwaModalOpen} onClose={() => setPwaModalOpen(false)} />
    </>
  );
}