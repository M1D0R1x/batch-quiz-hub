import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { getSessionUser } from "@/lib/auth.functions";
import { getMyProfile } from "@/lib/quiz.functions";

function AuthenticatedLayout() {
  return <Outlet />;
}

export const Route = createFileRoute("/_authenticated")({
  ssr: false,
  beforeLoad: async ({ location }) => {
    const session = await getSessionUser();
    if (!session?.userId) throw redirect({ to: "/auth" });

    // Enforce onboarding on first login only if user has never set a display name and has no onboarded_at.
    if (location.pathname !== "/onboarding") {
      try {
        const profile = await getMyProfile();
        if (profile && !profile.onboarded_at && !profile.display_name) {
          throw redirect({ to: "/onboarding" });
        }
      } catch (err: any) {
        // If it's a redirect, re-throw it (TanStack Router uses thrown redirects)
        if (err && typeof err === "object" && "to" in err) throw err;
        // Otherwise swallow — let the page load and handle the error gracefully
        console.warn("[auth guard] Could not check onboarding status:", err?.message);
      }
    }

    return { userId: session.userId };
  },
  component: AuthenticatedLayout,
});

