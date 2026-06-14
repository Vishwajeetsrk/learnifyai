import { c as createServerRpc } from "./createServerRpc-0AUf3IhG.mjs";
import { b as createServerFn } from "./server-BLOOEPZP.mjs";
import "../_libs/seroval.mjs";
import "../_libs/react.mjs";
import { o as objectType, s as stringType } from "../_libs/zod.mjs";
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
const Input = objectType({
  email: stringType().email(),
  fullName: stringType().max(120).optional()
});
function escapeHtml(value) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
async function sendResendEmail({
  to,
  subject,
  html
}) {
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) throw new Error("Email service not configured.");
  const body = JSON.stringify({
    from: "Learnify AI <onboarding@resend.dev>",
    to: [to],
    subject,
    html
  });
  const gateway = "https://connector-gateway.lovable.dev/resend/emails";
  const response = await fetch(gateway, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Connection-Api-Key": RESEND_API_KEY
    },
    body
  });
  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Email send failed (${response.status}): ${text}`);
  }
}
const sendWelcomeEmail_createServerFn_handler = createServerRpc({
  id: "2c8daa5f1ea93e574a34c03dce003349931bbef772e387a1cafe14f69bdf379b",
  name: "sendWelcomeEmail",
  filename: "src/lib/welcome-email.functions.ts"
}, (opts) => sendWelcomeEmail.__executeServer(opts));
const sendWelcomeEmail = createServerFn({
  method: "POST"
}).inputValidator((input) => Input.parse(input)).handler(sendWelcomeEmail_createServerFn_handler, async ({
  data
}) => {
  const name = data.fullName?.trim() || "Learner";
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(data.email);
  const html = `
      <div style="font-family:Inter,system-ui,sans-serif;color:#0f172a;line-height:1.6">
        <h1 style="font-size:24px;margin-bottom:12px;color:#111827">Welcome to Learnify AI, ${safeName}!</h1>
        <p style="font-size:16px;margin-bottom:16px">Your account is ready. Start exploring courses, building skills, and creating content in your Creator Studio.</p>
        <p style="font-size:16px;margin-bottom:16px">If you need help, just reply to this email or visit Learnify AI anytime.</p>
        <p style="font-size:16px;margin-bottom:0;font-weight:600">Happy learning,</p>
        <p style="font-size:16px;margin-top:4px;color:#475569">The Learnify AI team</p>
      </div>
    `;
  await sendResendEmail({
    to: safeEmail,
    subject: "Welcome to Learnify AI",
    html
  });
  return {
    ok: true
  };
});
export {
  sendWelcomeEmail_createServerFn_handler
};
