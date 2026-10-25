/**
 * Hark Webhook & Push Notification Service
 * Integrates with https://github.com/R44VC0RP/hark (hark.ryan.ceo)
 * 
 * Supports:
 * - Rich push notifications to iOS devices
 * - Dynamic Island & Lock Screen Live Activities
 * - Interactive approvals & web passes for Learnify AI
 */

export interface HarkNotificationPayload {
  title: string;
  body: string;
  url?: string;
  icon?: string;
  priority?: "low" | "normal" | "high" | "urgent";
  tags?: string[];
  idempotencyKey?: string;
}

export interface HarkLiveActivityPayload {
  name: string;
  title: string;
  subtitle?: string;
  currentProgress?: number; // 0 to 100
  totalProgress?: number;
  url?: string;
  state?: "active" | "completed" | "failed";
}

export interface HarkApprovalPayload {
  title: string;
  prompt: string;
  actions: Array<{ label: string; value: string; style?: "primary" | "destructive" | "default" }>;
  callbackUrl?: string;
}

/**
 * Dispatch a push notification via a configured Hark Webhook
 * @param webhookUrl The private webhook URL from Hark (e.g., https://hark.ryan.ceo/hooks/whk_...)
 * @param payload Notification details
 */
export async function sendHarkPush(
  webhookUrl: string,
  payload: HarkNotificationPayload
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  if (!webhookUrl || !webhookUrl.startsWith("https://hark.ryan.ceo/hooks/")) {
    return {
      success: false,
      error: "Invalid or missing Hark webhook URL. Must start with https://hark.ryan.ceo/hooks/",
    };
  }

  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(payload.idempotencyKey ? { "Idempotency-Key": payload.idempotencyKey } : {}),
      },
      body: JSON.stringify({
        title: payload.title.slice(0, 80),
        body: payload.body.slice(0, 8000),
        url: payload.url || "https://www.learnifyai.in/dashboard",
        icon: payload.icon || "https://www.learnifyai.in/logo.png",
        priority: payload.priority || "normal",
        tags: payload.tags || ["learnify-ai"],
      }),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "Unknown error");
      return { success: false, error: `Hark returned ${res.status}: ${errText}` };
    }

    const data = await res.json().catch(() => ({}));
    return { success: true, messageId: data.id || data.messageId };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to contact Hark service" };
  }
}

/**
 * Trigger an in-app browser alert or toast matching Hark's styling conventions
 */
export function formatHarkNotice(title: string, body: string, priority: string = "normal") {
  return {
    id: `notice_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    title,
    body,
    priority,
    timestamp: new Date().toISOString(),
  };
}
