import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut, Settings as SettingsIcon, User as UserIcon, Shield } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface Props {
  size?: "sm" | "md";
  showName?: boolean;
  className?: string;
}

export function UserAvatarMenu({ size = "md", showName = false, className }: Props) {
  const { user, isAdmin, signOut } = useAuth();
  const navigate = useNavigate();
  const [signed, setSigned] = useState<string | null>(null);

  const profileQuery = useQuery({
    enabled: !!user,
    queryKey: ["profile-mini", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("profiles")
        .select("full_name, avatar_url, xp, current_streak")
        .eq("id", user!.id)
        .maybeSingle();
      return data;
    },
  });

  useEffect(() => {
    const path = profileQuery.data?.avatar_url;
    if (!path) return setSigned(null);
    if (path.startsWith("http")) return setSigned(path);
    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    setSigned(data.publicUrl);
  }, [profileQuery.data?.avatar_url]);

  const name = profileQuery.data?.full_name ?? user?.email ?? "User";
  const initials = name
    .toString()
    .split(" ")
    .map((s: string) => s[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const sizeCls = size === "sm" ? "h-8 w-8" : "h-9 w-9";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "flex items-center gap-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary",
          className,
        )}
      >
        <Avatar className={sizeCls}>
          {signed && <AvatarImage src={signed} alt={name} />}
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/60 text-primary-foreground text-xs font-semibold">
            {initials}
          </AvatarFallback>
        </Avatar>
        {showName && (
          <div className="hidden sm:block text-left min-w-0">
            <div className="text-xs font-medium truncate max-w-[140px]">{name}</div>
            <div className="text-[10px] text-muted-foreground">{isAdmin ? "Admin" : "Member"}</div>
          </div>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex items-center gap-2">
          <Avatar className="h-8 w-8">
            {signed && <AvatarImage src={signed} alt={name} />}
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <div className="text-sm font-medium truncate">{name}</div>
            <div className="text-[11px] text-muted-foreground truncate">{user?.email}</div>
          </div>
        </DropdownMenuLabel>
        <div className="px-2 py-1.5 flex gap-2 justify-center text-xs font-semibold bg-muted/50 mx-2 mb-2 rounded-md">
          <div className="flex items-center text-orange-500">
            🔥 {profileQuery.data?.current_streak ?? 0}
          </div>
          <div className="flex items-center text-yellow-500">
            ⭐ {profileQuery.data?.xp ?? 0} XP
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/u/$id" params={{ id: user?.id ?? "" }}>
            <UserIcon className="h-4 w-4" /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to="/settings">
            <SettingsIcon className="h-4 w-4" /> Settings
          </Link>
        </DropdownMenuItem>
        {isAdmin && (
          <DropdownMenuItem asChild>
            <Link to="/admin">
              <Shield className="h-4 w-4" /> Admin
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => {
            await signOut();
            navigate({ to: "/", replace: true });
          }}
          className="text-destructive focus:text-destructive"
        >
          <LogOut className="h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
