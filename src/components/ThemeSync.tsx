import { useEffect, useRef } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useTheme, type ColorTheme, type Mode } from "@/hooks/use-theme";
import { supabase } from "@/integrations/supabase/client";

/**
 * Syncs theme preference to/from profiles.ui_prefs for signed-in users.
 * On sign-in: pulls remote prefs and applies them (overrides localStorage).
 * On change while signed-in: writes back to the profile.
 */
export function ThemeSync() {
  const { user } = useAuth();
  const { mode, color, setMode, setColor } = useTheme();
  const hydratedFor = useRef<string | null>(null);

  // Pull remote prefs when user changes
  useEffect(() => {
    if (!user) {
      hydratedFor.current = null;
      return;
    }
    if (hydratedFor.current === user.id) return;
    hydratedFor.current = user.id;
    (async () => {
      const { data } = await supabase
        .from("profiles")
        .select("ui_prefs")
        .eq("id", user.id)
        .maybeSingle();
      const prefs = (data as { ui_prefs?: { mode?: Mode; color?: ColorTheme } } | null)?.ui_prefs;
      if (prefs?.mode && prefs.mode !== mode) setMode(prefs.mode);
      if (prefs?.color && prefs.color !== color) setColor(prefs.color);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Push prefs upstream on change (after initial hydration)
  useEffect(() => {
    if (!user || hydratedFor.current !== user.id) return;
    const t = setTimeout(() => {
      supabase
        .from("profiles")
        .update({ ui_prefs: { mode, color } } as never)
        .eq("id", user.id);
    }, 400);
    return () => clearTimeout(t);
  }, [user, mode, color]);

  return null;
}
