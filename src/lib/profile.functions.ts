import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const updateProfile = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .validator((d: unknown) =>
    z
      .object({
        displayName: z.string().min(1).max(80).optional(),
        avatarPreset: z.string().optional(),
        showOnLeaderboard: z.boolean().optional(),
      })
      .parse(d)
  )
  .handler(async ({ data, context }) => {
    const update: Record<string, any> = {};
    if (data.displayName !== undefined) update.display_name = data.displayName;
    if (data.avatarPreset !== undefined) update.avatar_preset = data.avatarPreset;
    if (data.showOnLeaderboard !== undefined) update.show_on_leaderboard = data.showOnLeaderboard;

    const { error } = await (context.supabase.from("profiles" as any) as any)
      .update(update)
      .eq("id", context.userId);

    if (error) throw new Error(error.message);
    return { ok: true };
  });
