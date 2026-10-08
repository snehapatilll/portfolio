import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";

const variants: Record<Variant, string> = {
  primary:
    "bg-accent text-accent-contrast border-accent hover:brightness-110",
  secondary:
    "bg-surface text-text border-border hover:bg-raised hover:border-border-strong",
  ghost:
    "bg-transparent text-muted border-transparent hover:text-text hover:bg-surface",
};

export function Button({
  variant = "secondary",
  asChild = false,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: Variant;
  asChild?: boolean;
}) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(
        "inline-flex items-center justify-center gap-2 border px-4 py-2",
        "font-mono text-xs tracking-wide uppercase",
        "transition-colors duration-150",
        "disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}
