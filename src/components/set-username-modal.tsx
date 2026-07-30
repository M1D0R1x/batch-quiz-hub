import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getMyProfile } from "@/lib/quiz.functions";
import { setUsername } from "@/lib/auth.functions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sparkles, UserCheck } from "lucide-react";
import { toast } from "sonner";

const USERNAME_RE = /^[a-zA-Z0-9_.-]{3,30}$/;

export const SetUsernameModal: React.FC = () => {
  const queryClient = useQueryClient();
  const getProfileFn = useServerFn(getMyProfile);
  const setUsernameFn = useServerFn(setUsername);

  const { data: profile, isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: () => getProfileFn(),
    staleTime: 1000 * 60 * 5,
  });

  const [desiredUsername, setDesiredUsername] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const updateMutation = useMutation({
    mutationFn: (newUsername: string) => setUsernameFn({ data: { username: newUsername } }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["me"] });
      queryClient.invalidateQueries({ queryKey: ["leaderboard"] });
      toast.success("Username created! You can now use it to sign in.");
    },
    onError: (err: any) => {
      setErrorMsg(err.message || "Failed to set username.");
      toast.error(err.message || "Failed to set username.");
    },
  });

  // Only render if profile loaded and user has no username set
  if (isLoading || !profile || ((profile as any).username && (profile as any).username.trim().length > 0)) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const clean = desiredUsername.trim();

    if (!USERNAME_RE.test(clean)) {
      setErrorMsg("Username must be 3-30 characters: letters, numbers, '.', '_' or '-' only.");
      return;
    }

    updateMutation.mutate(clean);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md card-elevated p-6 space-y-6 shadow-2xl animate-in zoom-in-95 duration-200 border-primary/40">
        <div className="text-center space-y-2">
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm mb-1">
            <Sparkles className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-foreground">
            Create Your Username 🚀
          </h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Welcome back! Please choose a unique username for your account to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="set-username-input" className="font-semibold text-sm">
              Choose a Username
            </Label>
            <Input
              id="set-username-input"
              placeholder="e.g. alex_kumar"
              autoFocus
              required
              value={desiredUsername}
              onChange={(e) => {
                setDesiredUsername(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              className="text-base"
            />
            <p className="text-[11px] text-muted-foreground">
              3-30 characters: letters, numbers, '.', '_' or '-' only.
            </p>
            {errorMsg && (
              <p className="text-xs font-medium text-destructive">{errorMsg}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={updateMutation.isPending}
            className="w-full h-10 font-bold gap-2 text-sm"
          >
            <UserCheck className="w-4 h-4" />
            {updateMutation.isPending ? "Saving Username..." : "Set Username & Continue"}
          </Button>
        </form>
      </div>
    </div>
  );
};
