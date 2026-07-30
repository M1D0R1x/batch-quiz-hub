import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { toast } from "sonner";
import { AppHeader } from "@/components/app-header";
import { AvatarPicker } from "@/components/avatar-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { completeOnboarding, getMyProfile } from "@/lib/quiz.functions";
import { updateProfile } from "@/lib/profile.functions";
import { Sparkles, User2, CheckCircle2 } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome — QuizForge" },
      { name: "description", content: "Set up your profile to get started." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const meFn = useServerFn(getMyProfile);
  const finishFn = useServerFn(completeOnboarding);
  const updateProfileFn = useServerFn(updateProfile);

  const profile = useQuery({ queryKey: ["me"], queryFn: () => meFn() });

  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState("avatar_cloud_1");
  const [done, setDone] = useState(false);

  const updateProfileMutation = useMutation({
    mutationFn: (data: { displayName?: string; avatarPreset?: string }) =>
      updateProfileFn({ data }),
    onError: (e: any) => toast.error(e.message ?? "Failed to update profile"),
  });

  const finish = useMutation({
    mutationFn: (v: { displayName?: string }) => finishFn({ data: v }),
    onSuccess: async () => {
      await updateProfileMutation.mutateAsync({ avatarPreset: avatarId });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      // Show celebration then redirect
      setDone(true);
      setTimeout(() => {
        nav({ to: "/dashboard" });
      }, 1800);
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to save"),
  });

  const handleSubmit = () => {
    finish.mutate({
      displayName: name.trim() || profile.data?.display_name || undefined,
    });
  };

  if (done) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-6 animate-fade-up">
          {/* Celebration ring */}
          <div className="relative mx-auto w-28 h-28">
            <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
            <div className="absolute inset-2 rounded-full bg-primary/30 animate-ping [animation-delay:150ms]" />
            <div className="relative flex items-center justify-center w-28 h-28 rounded-full bg-gradient-to-br from-primary to-emerald-400 shadow-2xl shadow-primary/40">
              <CheckCircle2 className="w-14 h-14 text-white" strokeWidth={1.5} />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground">You're all set! 🎉</h1>
            <p className="mt-2 text-muted-foreground">Welcome to the Oracle PaaS Training Platform.</p>
            <p className="mt-1 text-sm text-muted-foreground">Taking you to the dashboard…</p>
          </div>
          {/* Sparkle dots */}
          <div className="flex justify-center gap-2">
            {[0, 1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-primary animate-bounce"
                style={{ animationDelay: `${i * 100}ms` }}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-grid">
      <AppHeader />
      <main className="mx-auto max-w-lg px-4 py-16">
        <div className="animate-fade-up space-y-8">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
              <User2 className="w-3.5 h-3.5" />
              Profile Setup
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Welcome to QuizForge!
            </h1>
            <p className="text-muted-foreground">
              Choose a display name and avatar to represent you on the leaderboard.
            </p>
          </div>

          {/* Form card */}
          <div className="card-elevated p-8 space-y-8">
            {/* Name input */}
            <div className="space-y-2">
              <Label htmlFor="dn" className="font-semibold text-sm">
                Display Name
              </Label>
              <Input
                id="dn"
                placeholder={profile.data?.display_name ?? "Your full name"}
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="text-base h-12"
                autoFocus
              />
              <p className="text-xs text-muted-foreground">This is how others see you on the leaderboard.</p>
            </div>

            {/* Avatar picker */}
            <AvatarPicker selectedAvatarId={avatarId} onSelectAvatar={setAvatarId} />
          </div>

          {/* CTA */}
          <Button
            size="lg"
            className="w-full h-13 text-base gap-2 shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-shadow"
            disabled={finish.isPending || updateProfileMutation.isPending}
            onClick={handleSubmit}
          >
            <Sparkles className="w-5 h-5" />
            {finish.isPending || updateProfileMutation.isPending ? "Setting up your account…" : "Start Learning 🚀"}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            You can update your profile anytime from the header menu.
          </p>
        </div>
      </main>
    </div>
  );
}