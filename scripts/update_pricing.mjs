import { createClient } from "@supabase/supabase-js";
import fs from "fs";

const env = fs.readFileSync(".env", "utf8");
let supabaseUrl = "";
let supabaseKey = "";
for (const line of env.split("\n")) {
  if (line.startsWith("NEXT_PUBLIC_SUPABASE_URL=") || line.startsWith("SUPABASE_URL="))
    supabaseUrl = line.split("=")[1].trim().replace(/^"|"$/g, "");
  if (line.startsWith("SUPABASE_SERVICE_ROLE_KEY="))
    supabaseKey = line.split("=")[1].trim().replace(/^"|"$/g, "");
}

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabaseAdmin = createClient(supabaseUrl, supabaseKey);

async function main() {
  const { data: plans } = await supabaseAdmin.from("pricing_plans").select("*");
  console.log("Found plans:", plans);

  for (const plan of plans) {
    let features = plan.features;
    if (plan.name === "Starter") {
      features = [
        "3 free courses",
        "Basic AI tutor",
        "500 free AI credits",
        "Community access",
        "Progress tracking",
      ];
    } else if (plan.name === "Pro") {
      features = [
        "Unlimited courses",
        "Advanced AI tools",
        "10,000 AI credits/mo",
        "Certificates",
        "Priority support",
        "Creator monetization",
      ];
    } else if (plan.name === "Team") {
      features = [
        "Seat-based billing",
        "Admin dashboard",
        "Unlimited AI credits",
        "SSO + RBAC",
        "Custom branding",
        "Dedicated success",
      ];
    }
    await supabaseAdmin.from("pricing_plans").update({ features }).eq("id", plan.id);
    console.log("Updated plan:", plan.name);
  }
}

main().catch(console.error);
