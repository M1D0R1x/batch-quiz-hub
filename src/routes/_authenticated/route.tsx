import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data, error } = await supabase.auth.getUser();
    if (error || !data.user) throw redirect({ to: "/auth" });

    // Enforce onboarding on first login — redirect everywhere except /onboarding itself
    if (location.pathname !== "/onboarding") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarded_at")
        .eq("id", data.user.id)
        .maybeSingle();
      if (profile && !profile.onboarded_at) {
        throw redirect({ to: "/onboarding" });
      }
    }

    return { user: data.user };
  },
  component: () => <Outlet />,
});