import { c as createServerRpc } from "./createServerRpc-0AUf3IhG.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import "node:async_hooks";
import "../_libs/h3-v2.mjs";
import "../_libs/rou3.mjs";
import "../_libs/srvx.mjs";
import "node:stream";
import "../_libs/tanstack__router-core.mjs";
import "../_libs/tanstack__history.mjs";
import "../_libs/cookie-es.mjs";
import "../_libs/seroval-plugins.mjs";
import "node:stream/web";
import "../_libs/tanstack__react-router.mjs";
import "../_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "../_libs/isbot.mjs";
const getPlatformStats_createServerFn_handler = createServerRpc({
  id: "650b04cc0e21de1a2a2c7a4767bb223985953e97b50d84eeb1221e8983ab99f1",
  name: "getPlatformStats",
  filename: "src/lib/stats.functions.ts"
}, (opts) => getPlatformStats.__executeServer(opts));
const getPlatformStats = createServerFn({
  method: "GET"
}).handler(getPlatformStats_createServerFn_handler, async () => {
  const {
    supabaseAdmin
  } = await import("./client.server-BbcUHF3e.mjs");
  const safeCount = async (table, filter) => {
    try {
      const client = supabaseAdmin;
      let q = client.from(table).select("*", {
        count: "exact",
        head: true
      });
      if (filter) q = filter(q);
      const {
        count,
        error
      } = await q;
      if (error) return 0;
      return count ?? 0;
    } catch {
      return 0;
    }
  };
  const [learners, courses, creators, enrollments, certificates] = await Promise.all([safeCount("profiles"), safeCount("courses", (q) => q.eq("published", true)), safeCount("profiles", (q) => q.eq("role", "creator")), safeCount("enrollments"), safeCount("certificates")]);
  return {
    learners,
    courses,
    creators: creators || Math.max(1, Math.floor(learners * 0.05)),
    enrollments,
    certificates,
    countries: 42
  };
});
export {
  getPlatformStats_createServerFn_handler
};
