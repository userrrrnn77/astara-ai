import clsx from "clsx";

type SpinnerSize = "sm" | "md" | "lg";

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeClasses: Record<SpinnerSize, string> = {
  sm: "w-3.5 h-3.5 border-[1.5px]",
  md: "w-5 h-5 border-2",
  lg: "w-8 h-8 border-2",
};

export function Spinner({ size = "md", className }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={clsx(
        "inline-block animate-spin rounded-full",
        "border-current border-t-transparent opacity-70",
        sizeClasses[size],
        className,
      )}
    />
  );
}
