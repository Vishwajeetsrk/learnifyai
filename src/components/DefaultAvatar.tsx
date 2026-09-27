import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

import { getRealHumanAvatar } from "@/lib/real-avatars";

export function getDefaultAvatar(name?: string | null): string {
  return getRealHumanAvatar(name);
}

interface DefaultAvatarProps {
  src?: string | null;
  name?: string | null;
  className?: string;
  fallbackClassName?: string;
  imgClassName?: string;
}

export function DefaultAvatar({
  src,
  name,
  className,
  fallbackClassName,
  imgClassName,
}: DefaultAvatarProps) {
  const fallback = getDefaultAvatar(name);
  const initials =
    name
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?";

  return (
    <Avatar className={className}>
      {src ? <AvatarImage src={src} className={imgClassName} /> : null}
      <AvatarFallback className={cn("bg-muted", fallbackClassName)} delayMs={src ? 600 : 0}>
        {!src && <img src={fallback} alt="" className="h-full w-full object-cover rounded-full" />}
        {src ? initials : null}
      </AvatarFallback>
    </Avatar>
  );
}
