import { r as reactExports, e as jsxDevRuntimeExports } from "./_libs/react.mjs";
import { e as useNavigate, O as Outlet } from "./_libs/tanstack__react-router.mjs";
import { u as useAuth } from "./_ssr/router-BGh9Ntsg.mjs";
import "./_libs/sonner.mjs";
import { L as LoaderCircle } from "./_libs/lucide-react.mjs";
import "./_libs/tanstack__router-core.mjs";
import "./_libs/tanstack__history.mjs";
import "./_libs/cookie-es.mjs";
import "./_libs/seroval.mjs";
import "./_libs/seroval-plugins.mjs";
import "node:stream/web";
import "node:stream";
import "./_libs/react-dom.mjs";
import "util";
import "crypto";
import "async_hooks";
import "stream";
import "./_libs/isbot.mjs";
import "./_libs/tanstack__query-core.mjs";
import "./_libs/tanstack__react-query.mjs";
import "./_libs/supabase__supabase-js.mjs";
import "./_libs/supabase__postgrest-js.mjs";
import "./_libs/supabase__realtime-js.mjs";
import "./_libs/supabase__phoenix.mjs";
import "./_libs/supabase__storage-js.mjs";
import "./_libs/iceberg-js.mjs";
import "./_libs/supabase__auth-js.mjs";
import "tslib";
import "./_libs/supabase__functions-js.mjs";
import "./_ssr/client.server-BbcUHF3e.mjs";
import "./_libs/framer-motion.mjs";
import "./_libs/motion-dom.mjs";
import "./_libs/motion-utils.mjs";
import "./_libs/zod.mjs";
function AuthenticatedLayout() {
  const {
    loading,
    isAuthenticated
  } = useAuth();
  const navigate = useNavigate();
  reactExports.useEffect(() => {
    if (!loading && !isAuthenticated) navigate({
      to: "/login",
      replace: true
    });
  }, [loading, isAuthenticated, navigate]);
  if (loading || !isAuthenticated) {
    return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV("div", { className: "min-h-screen flex items-center justify-center", children: /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(LoaderCircle, { className: "h-6 w-6 animate-spin text-muted-foreground" }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated.tsx?tsr-split=component",
      lineNumber: 19,
      columnNumber: 9
    }, this) }, void 0, false, {
      fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated.tsx?tsr-split=component",
      lineNumber: 18,
      columnNumber: 12
    }, this);
  }
  return /* @__PURE__ */ jsxDevRuntimeExports.jsxDEV(Outlet, {}, void 0, false, {
    fileName: "C:/Users/vishw/Music/Learnify AI/src/routes/_authenticated.tsx?tsr-split=component",
    lineNumber: 22,
    columnNumber: 10
  }, this);
}
export {
  AuthenticatedLayout as component
};
