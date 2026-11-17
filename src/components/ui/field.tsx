import * as React from "react";
import { cn } from "@/lib/utils";

export function Field({
  className,
  orientation = "vertical",
  ...props
}: React.ComponentProps<"div"> & { orientation?: "horizontal" | "vertical" }) {
  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        "grid gap-2 group/field",
        orientation === "horizontal" && "flex items-start gap-2.5",
        className
      )}
      {...props}
    />
  );
}

export function FieldGroup({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-group" className={cn("grid gap-4", className)} {...props} />;
}

export function FieldLabel({ className, ...props }: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 group-has-[:disabled]/field:opacity-50",
        className
      )}
      {...props}
    />
  );
}

export function FieldTitle({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-title" className={cn("text-sm font-semibold", className)} {...props} />;
}

export function FieldDescription({ className, ...props }: React.ComponentProps<"p">) {
  return <p data-slot="field-description" className={cn("text-xs text-muted-foreground", className)} {...props} />;
}

export function FieldContent({ className, ...props }: React.ComponentProps<"div">) {
  return <div data-slot="field-content" className={cn("space-y-1.5", className)} {...props} />;
}
