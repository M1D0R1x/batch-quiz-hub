import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/theme-toggle";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";


export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Sign in — QuizForge" },
      { name: "description", content: "Sign in or create your QuizForge account to start practicing." },
      { property: "og:title", content: "Sign in — QuizForge" },
      { property: "og:description", content: "Sign in or create your QuizForge account to start practicing." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && user) navigate({ to: "/dashboard" });
  }, [loading, user, navigate]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const res = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: name || email.split("@")[0] },
          },
        });

        if (res.error) {
          // If rate-limited on sign up (HTTP 429), fallback to direct sign in attempt
          if ((res.error as any).status === 429 || res.error.message?.toLowerCase().includes("rate limit") || res.error.message?.includes("429")) {
            const fallbackSign = await supabase.auth.signInWithPassword({ email, password });
            if (fallbackSign.data?.session) {
              toast.success("Welcome back!");
              navigate({ to: "/dashboard" });
              return;
            }
            throw new Error("Sign-up rate limit reached. If you already created an account, please switch to 'Sign in'.");
          }
          throw res.error;
        }
        
        if (res.data.session) {
          toast.success("Account created successfully!");
          navigate({ to: "/onboarding" });
        } else {
          // Attempt instant sign-in if email confirmation is disabled in Supabase
          const signRes = await supabase.auth.signInWithPassword({ email, password });
          if (!signRes.error && signRes.data.session) {
            toast.success("Account created!");
            navigate({ to: "/onboarding" });
          } else {
            toast.success("Account created! You can now sign in.");
            setMode("signin");
          }
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
    } catch (err: any) {
      toast.error(err.message ?? "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) {
        if (error.message?.includes("provider is not enabled")) {
          throw new Error("Google Sign-In is not enabled in Supabase project settings. Please sign in with Email & Password.");
        }
        throw error;
      }
    } catch (err: any) {
      toast.error(err?.message ?? "Google sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="absolute inset-0 -z-10 bg-grid opacity-30" />
      <div className="absolute inset-x-0 top-0 -z-10 h-[420px] bg-gradient-to-b from-primary/15 via-transparent to-transparent" />

      <div className="absolute right-4 top-4"><ThemeToggle /></div>

      <div className="w-full max-w-md animate-fade-up">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 font-display text-lg font-semibold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          QuizForge
        </Link>

        <div className="card-elevated p-6">
          <Tabs value={mode} onValueChange={(v) => setMode(v as any)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign in</TabsTrigger>
              <TabsTrigger value="signup">Sign up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin" className="mt-6">
              <form onSubmit={handleEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Signing in…" : "Sign in"}
                </Button>
              </form>
            </TabsContent>

            <TabsContent value="signup" className="mt-6">
              <form onSubmit={handleEmail} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full name</Label>
                  <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Alex Kumar" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email2">Email</Label>
                  <Input id="email2" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pw2">Password</Label>
                  <Input id="pw2" type="password" required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <Button type="submit" className="w-full" disabled={busy}>
                  {busy ? "Creating account…" : "Create account"}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to our practice-only terms. No exam content is redistributed.
        </p>
      </div>
    </div>
  );
}