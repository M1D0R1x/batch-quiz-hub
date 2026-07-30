import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSessionUser } from "@/lib/auth.functions";
import { getMyProfile } from "@/lib/quiz.functions";

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const session = await getSessionUser();
    if (!session?.userId) throw redirect({ to: "/auth" });

    // Enforce onboarding on first login — redirect everywhere except /onboarding itself
    if (location.pathname !== "/onboarding") {
      const profile = await getMyProfile();
      if (profile && !profile.onboarded_at) {
        throw redirect({ to: "/onboarding" });
      }
    }

    return { userId: session.userId };
  },
  component: () => <Outlet />,
});
