const { Client } = require("pg");
const fs = require("fs");
const path = require("path");

function readEnv(file) {
  try {
    const content = fs.readFileSync(file, "utf8");
    const env = {};
    for (const line of content.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m) env[m[1].trim()] = m[2].trim().replace(/^"|"$/g, "");
    }
    return env;
  } catch {
    return {};
  }
}

const env = { ...readEnv(".env"), ...readEnv(".env.local") };
const dbUrl = env.DATABASE_URL;
const appId = env.CASHFREE_APP_ID;
const secretKey = env.CASHFREE_SECRET_KEY;

if (!dbUrl) {
  console.error("DATABASE_URL not found in .env or .env.local");
  process.exit(1);
}

if (!appId || !secretKey) {
  console.error(
    "Cashfree credentials (CASHFREE_APP_ID, CASHFREE_SECRET_KEY) not found in .env or .env.local",
  );
  process.exit(1);
}

const isSandbox = appId.startsWith("TEST") || appId.includes("sandbox");
const cashfreeApiUrl = isSandbox
  ? "https://sandbox.cashfree.com/pg"
  : "https://api.cashfree.com/pg";

console.log(`Using Cashfree environment: ${isSandbox ? "Sandbox" : "Production"}`);
console.log(`API URL: ${cashfreeApiUrl}`);

async function main() {
  const client = new Client({ connectionString: dbUrl, ssl: { rejectUnauthorized: false } });
  await client.connect();

  // Find all active paid plans that don't have a Cashfree plan ID
  const { rows: plans } = await client.query(
    "SELECT id, name, price_inr, interval, description FROM pricing_plans WHERE active = true AND price_inr > 0 AND cashfree_plan_id IS NULL;",
  );

  console.log(`Found ${plans.length} plans to sync with Cashfree.`);

  for (const plan of plans) {
    const cfPlanId = `plan_${plan.id.slice(0, 8)}`;
    console.log(`Syncing plan: ${plan.name} (${cfPlanId})...`);

    try {
      const res = await fetch(`${cashfreeApiUrl}/plans`, {
        method: "POST",
        headers: {
          "x-api-version": "2025-01-01",
          "x-client-id": appId,
          "x-client-secret": secretKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          plan_id: cfPlanId,
          plan_name: plan.name,
          plan_type: "PERIODIC",
          plan_currency: "INR",
          plan_recurring_amount: parseFloat(plan.price_inr),
          plan_max_amount: parseFloat(plan.price_inr) * 12,
          plan_max_cycles: 0,
          plan_intervals: 1,
          plan_interval_type: plan.interval === "month" ? "MONTH" : "YEAR",
          plan_note: plan.description || "",
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        console.error(`  Cashfree API returned error: ${errText}`);

        console.log(`  Updating database with expected plan ID: ${cfPlanId}`);
        await client.query("UPDATE pricing_plans SET cashfree_plan_id = $1 WHERE id = $2;", [
          cfPlanId,
          plan.id,
        ]);
        console.log(`  Updated ${plan.name} in DB.`);
      } else {
        const cf = await res.json();
        const cashfreePlanId = cf.plan_id || cfPlanId;
        await client.query("UPDATE pricing_plans SET cashfree_plan_id = $1 WHERE id = $2;", [
          cashfreePlanId,
          plan.id,
        ]);
        console.log(
          `  Successfully synced and updated ${plan.name} with cashfree_plan_id: ${cashfreePlanId}`,
        );
      }
    } catch (err) {
      console.error(`  Failed to sync ${plan.name}:`, err.message);
    }
  }

  await client.end();
}

main().catch(console.error);
