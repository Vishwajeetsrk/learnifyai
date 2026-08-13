import { supabaseAdmin } from "@/integrations/supabase/client.server";

/**
 * Validates the authentication token from either the Authorization header (Bearer)
 * or cookies, and returns the authenticated Supabase User object if valid.
 */
export async function getAuthenticatedUser(request: Request) {
  let token = "";
  const authHeader = request.headers.get("authorization");

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.replace("Bearer ", "");
  } else {
    // Parse cookies safely
    const cookieHeader = request.headers.get("cookie") || "";
    const cookiesMap: Record<string, string> = {};

    cookieHeader.split(";").forEach((c) => {
      const eqIndex = c.indexOf("=");
      if (eqIndex > -1) {
        cookiesMap[c.substring(0, eqIndex).trim()] = c.substring(eqIndex + 1).trim();
      }
    });

    // Prioritize Supabase access tokens
    if (cookiesMap["sb-access-token"]) {
      token = cookiesMap["sb-access-token"];
    } else if (cookiesMap["supabase-auth-token"]) {
      token = cookiesMap["supabase-auth-token"];
    } else if (cookiesMap["sb-auth-token"]) {
      token = cookiesMap["sb-auth-token"];
    } else {
      // Find any sb- cookie that is NOT a refresh or provider token
      const sbKey = Object.keys(cookiesMap).find(
        (k) =>
          k.startsWith("sb-") && !k.endsWith("-refresh-token") && !k.endsWith("-provider-token"),
      );
      if (sbKey) {
        token = cookiesMap[sbKey];
      }
    }
  }

  if (!token) {
    return null;
  }

  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data?.user) {
      return null;
    }
    return data.user;
  } catch (err) {
    console.error("[auth-helpers] Error validating user token:", err);
    return null;
  }
}
