import * as React from "react";
import { cn } from "@/lib/utils";

export function InputGroup({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="input-group"
      className={cn("relative flex items-center w-full group/input-group", className)}
      {...props}
    />
  );
}

export function InputGroupAddon({
  className,
  align,
  ...props
}: React.ComponentProps<"div"> & { align?: "inline-start" | "inline-end" | string }) {
  return (
    <div
      data-slot="input-group-addon"
      data-align={align}
      className={cn("flex items-center px-2.5 text-muted-foreground shrink-0", className)}
      {...props}
    />
  );
}

export function InputGroupButton({
  className,
  variant,
  size,
  render,
  ...props
}: React.ComponentProps<"button"> & {
  variant?: string;
  size?: string;
  render?: React.ReactNode;
}) {
  if (render && React.isValidElement(render)) {
    return React.cloneElement(render as React.ReactElement<any>, {
      className: cn((render.props as any).className, className),
      ...props,
    });
  }

  return (
    <button
      type="button"
      data-slot="input-group-button"
      className={cn(
        "inline-flex items-center justify-center text-sm font-medium transition-colors hover:bg-muted/80 rounded px-2 py-1",
        className
      )}
      {...props}
    />
  );
}

export function InputGroupInput({ className, ...props }: React.ComponentProps<"input">) {
  return (
    <input
      data-slot="input-group-input"
      className={cn(
        "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-xs transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  );
}
