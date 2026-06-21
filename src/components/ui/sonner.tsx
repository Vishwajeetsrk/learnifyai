import { Toaster as Sonner } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-2 group-[.toaster]:border-border group-[.toaster]:shadow-card group-[.toaster]:rounded-2xl overflow-hidden",
          description: "group-[.toast]:text-muted-foreground font-medium",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-xl group-[.toast]:px-4 group-[.toast]:py-2",
          cancelButton:
            "group-[.toast]:bg-muted group-[.toast]:text-muted-foreground group-[.toast]:rounded-xl group-[.toast]:px-4 group-[.toast]:py-2",
          success: "group-[.toaster]:border-emerald-500/50 group-[.toaster]:bg-emerald-500/10",
          error: "group-[.toaster]:border-destructive/50 group-[.toaster]:bg-destructive/10",
          warning: "group-[.toaster]:border-amber-500/50 group-[.toaster]:bg-amber-500/10",
          info: "group-[.toaster]:border-primary/50 group-[.toaster]:bg-primary/10",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
