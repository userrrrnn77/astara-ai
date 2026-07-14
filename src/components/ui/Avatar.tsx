import { useState } from "react";
import clsx from "clsx";

type AvatarSize = "sm" | "md" | "lg";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: AvatarSize;
  className?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "w-6 h-6 text-[11px]",
  md: "w-8 h-8 text-xs",
  lg: "w-10 h-10 text-sm",
};

function getInitials(name?: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImage = !!src && !imgFailed;

  return (
    <span
      className={clsx(
        "relative inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full",
        "bg-blue-700 font-semibold text-background-100 select-none",
        sizeClasses[size],
        className,
      )}>
      {showImage ? (
        <img
          src={src}
          alt={name ?? "Avatar"}
          className="h-full w-full object-cover"
          onError={() => setImgFailed(true)}
        />
      ) : (
        getInitials(name)
      )}
    </span>
  );
}
