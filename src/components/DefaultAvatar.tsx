import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const DEFAULT_AVATARS = [
  "/avatars/avatar-f1.svg",
  "/avatars/avatar-f2.svg",
  "/avatars/avatar-f3.svg",
  "/avatars/avatar-m1.svg",
  "/avatars/avatar-m2.svg",
  "/avatars/avatar-m3.svg",
];

function hashName(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) {
    h = ((h << 5) - h + name.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

export function getDefaultAvatar(name?: string | null): string {
  const idx = name ? hashName(name) % DEFAULT_AVATARS.length : 0;
  return DEFAULT_AVATARS[idx];
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
  const initials = name
    ?.split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "?";

  return (
    <Avatar className={className}>
      {src ? <AvatarImage src={src} className={imgClassName} /> : null}
      <AvatarFallback
        className={cn("bg-muted", fallbackClassName)}
        delayMs={src ? 600 : 0}
      >
        {!src && (
          <img
            src={fallback}
            alt=""
            className="h-full w-full object-cover rounded-full"
          />
        )}
        {src ? initials : null}
      </AvatarFallback>
    </Avatar>
  );
}
