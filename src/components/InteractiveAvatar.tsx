import { cn } from "@/lib/utils";

interface InteractiveAvatarProps {
  src: string;
  name: string;
  className?: string;
  size?: number;
  onClick?: () => void;
}

export function InteractiveAvatar({
  src,
  name,
  className,
  size = 128,
  onClick,
}: InteractiveAvatarProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "relative inline-block select-none overflow-hidden rounded-full group",
        className,
      )}
      style={{ width: size, height: size }}
    >
      {/* Base Avatar Image */}
      <img
        src={src}
        alt={name}
        className="w-full h-full object-cover rounded-full transition-transform duration-300 group-hover:scale-105"
        draggable={false}
      />
    </div>
  );
}
