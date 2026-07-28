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
import { Skeleton } from "@/components/ui/skeleton";
import { listCourses, completeOnboarding, getMyProfile } from "@/lib/quiz.functions";
import { updateProfile } from "@/lib/profile.functions";
import { GraduationCap, User2, BookOpen } from "lucide-react";

export const Route = createFileRoute("/_authenticated/onboarding")({
  head: () => ({
    meta: [
      { title: "Welcome — QuizForge" },
      { name: "description", content: "Set up your profile and pick your course track to get started." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Onboarding,
});

function Onboarding() {
  const nav = useNavigate();
  const queryClient = useQueryClient();
  const listFn = useServerFn(listCourses);
  const meFn = useServerFn(getMyProfile);
  const finishFn = useServerFn(completeOnboarding);
  const updateProfileFn = useServerFn(updateProfile);

  const courses = useQuery({ queryKey: ["courses"], queryFn: () => listFn() });
  const profile = useQuery({ queryKey: ["me"], queryFn: () => meFn() });

  const [step, setStep] = useState(0); // 0=profile setup, 1=course select
  const [selected, setSelected] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [avatarId, setAvatarId] = useState("avatar_cloud_1");

  const updateProfileMutation = useMutation({
    mutationFn: (data: { displayName?: string; avatarPreset?: string }) =>
      updateProfileFn({ data }),
    onError: (e: any) => toast.error(e.message ?? "Failed to update profile"),
  });

  const finish = useMutation({
    mutationFn: (v: { courseTrackId: string; displayName?: string }) =>
      finishFn({ data: v }),
    onSuccess: async () => {
      // Also update avatar
      await updateProfileMutation.mutateAsync({ avatarPreset: avatarId });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      toast.success("You're all set! Welcome to the Oracle PaaS Training Platform 🎉");
      nav({ to: "/dashboard" });
    },
    onError: (e: any) => toast.error(e.message ?? "Failed to save"),
  });

  const handleNextStep = () => {
    if (step === 0) {
      setStep(1);
    }
  };

  const handleSubmit = () => {
    if (!selected) return;
    finish.mutate({
      courseTrackId: selected,
      displayName: name.trim() || profile.data?.display_name || undefined,
    });
  };

  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-10">
        <div className="animate-fade-up space-y-8">
          {/* Progress indicator */}
          <div className="flex items-center gap-3">
            {[
              { label: "Your Profile", icon: User2 },
              { label: "Course Track", icon: BookOpen },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                      i === step
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : i < step
                        ? "bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    {s.label}
                  </div>
                  {i < 1 && <div className="h-px w-8 bg-border" />}
                </div>
              );
            })}
          </div>

          <div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              {step === 0 ? "Set Up Your Profile" : "Choose Your Course Track"}
            </h1>
            <p className="mt-2 text-muted-foreground">
              {step === 0
                ? "Pick a display name and avatar to represent you on the leaderboard."
                : "Select the primary track for your training. You can practice across all courses anytime."}
            </p>
          </div>

          {step === 0 && (
            <div className="card-elevated p-6 space-y-6">
              <div className="space-y-2">
                <Label htmlFor="dn" className="font-semibold">
                  Display Name
                </Label>
                <Input
                  id="dn"
                  placeholder={profile.data?.display_name ?? "Your full name"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="text-base"
                />
              </div>
              <AvatarPicker selectedAvatarId={avatarId} onSelectAvatar={setAvatarId} />
            </div>
          )}

          {step === 1 && (
            <div className="grid gap-3">
              {courses.isLoading &&
                Array.from({ length: 2 }).map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              {(courses.data ?? []).map((c: any) => {
                const active = selected === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelected(c.id)}
                    className={`card-elevated flex items-start justify-between gap-4 p-5 text-left transition hover:-translate-y-0.5 ${
                      active ? "ring-2 ring-primary border-primary/50" : "hover:border-primary/30"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`p-2.5 rounded-xl shrink-0 transition-colors ${
                          active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        <GraduationCap className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="font-bold text-foreground">{c.name}</div>
                        <div className="mt-1 text-sm text-muted-foreground">{c.description}</div>
                      </div>
                    </div>
                    <div className="whitespace-nowrap shrink-0 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                      {c.subtopics.length} chapters
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            {step > 0 ? (
              <Button variant="ghost" onClick={() => setStep(0)}>
                ← Back
              </Button>
            ) : (
              <div />
            )}

            {step === 0 ? (
              <Button size="lg" onClick={handleNextStep}>
                Continue →
              </Button>
            ) : (
              <Button
                size="lg"
                disabled={!selected || finish.isPending}
                onClick={handleSubmit}
                className="gap-2"
              >
                {finish.isPending ? "Saving…" : "Start Training 🚀"}
              </Button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}