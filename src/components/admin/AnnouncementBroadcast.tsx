import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Megaphone, Send, Loader2, Users, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { sendAnnouncement } from "@/lib/admin-announcements.functions";

export function AnnouncementBroadcast() {
  const sendFn = useServerFn(sendAnnouncement);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [type, setType] = useState<string>("info");
  const [targetRole, setTargetRole] = useState<string>("all");
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ notifiedCount: number; totalTarget: number } | null>(null);

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Title and body are required");
      return;
    }

    setSending(true);
    setResult(null);
    try {
      const res = await sendFn({ data: { title: title.trim(), body: body.trim(), type: type as any, targetRole: targetRole as any } });
      if (res.success) {
        setResult({ notifiedCount: res.notifiedCount ?? 0, totalTarget: res.totalTarget ?? 0 });
        toast.success(`Announcement sent to ${res.notifiedCount} users!`);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to send announcement");
    } finally {
      setSending(false);
    }
  };

  const handleReset = () => {
    setTitle("");
    setBody("");
    setType("info");
    setTargetRole("all");
    setResult(null);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-rose-50 dark:bg-rose-950/40 rounded-xl border border-rose-200 dark:border-rose-800">
          <Megaphone className="h-5 w-5 text-rose-600 dark:text-rose-400" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Announcement Broadcast</h3>
          <p className="text-xs text-muted-foreground">Send in-app notifications to all users or filtered groups</p>
        </div>
      </div>

      <Card className="p-6 rounded-xl border shadow-sm space-y-5">
        <div className="space-y-2">
          <Label className="text-xs font-bold">Title</Label>
          <Input
            placeholder="e.g. Platform Maintenance Tonight"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-sm"
            disabled={sending}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-bold">Body</Label>
          <Textarea
            placeholder="Write your announcement message..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="min-h-[140px] text-sm"
            disabled={sending}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-bold">Type</Label>
            <Select value={type} onValueChange={setType} disabled={sending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="info">Info</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="success">Success</SelectItem>
                <SelectItem value="promo">Promotion</SelectItem>
                <SelectItem value="maintenance">Maintenance</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-bold">Target Audience</Label>
            <Select value={targetRole} onValueChange={setTargetRole} disabled={sending}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">
                  <div className="flex items-center gap-2"><Globe className="h-3.5 w-3.5" /> All Users</div>
                </SelectItem>
                <SelectItem value="students">Students</SelectItem>
                <SelectItem value="creators">Creators</SelectItem>
                <SelectItem value="admins">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2 pt-2">
          <Button onClick={handleSend} disabled={sending || !title.trim() || !body.trim()} className="gap-2">
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            {sending ? "Sending..." : "Send Announcement"}
          </Button>
          <Button variant="outline" onClick={handleReset} disabled={sending}>Reset</Button>
        </div>
      </Card>

      {result && (
        <Card className="p-5 rounded-xl border shadow-sm bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-800">
          <div className="flex items-center gap-3">
            <Users className="h-5 w-5 text-emerald-600" />
            <div>
              <p className="font-bold text-sm text-emerald-700 dark:text-emerald-300">Announcement sent successfully!</p>
              <p className="text-xs text-muted-foreground mt-0.5">
                Notified <strong>{result.notifiedCount}</strong> of <strong>{result.totalTarget}</strong> target users
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
