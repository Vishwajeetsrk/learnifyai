import { motion } from "framer-motion";
import { CreditCard, Check, Shield, Sparkles } from "lucide-react";

export function PaymentLoader({ label = "Processing your payment…" }: { label?: string }) {
  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-background/70 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: "spring", stiffness: 240, damping: 22 }}
        className="relative w-[min(360px,90vw)] rounded-3xl border bg-card p-7 text-center shadow-2xl overflow-hidden"
      >
        {/* animated gradient ring */}
        <div className="relative mx-auto h-20 w-20">
          <motion.div
            className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 via-violet-500 to-fuchsia-500"
            animate={{ rotate: 360 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "linear" }}
            style={{
              maskImage: "radial-gradient(circle, transparent 56%, black 58%)",
              WebkitMaskImage: "radial-gradient(circle, transparent 56%, black 58%)",
            }}
          />
          <div className="absolute inset-2 rounded-full bg-card grid place-items-center">
            <motion.div
              animate={{ scale: [1, 1.08, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
              className="h-10 w-10 rounded-2xl bg-gradient-to-br from-primary to-primary/60 text-primary-foreground grid place-items-center shadow-lg"
            >
              <CreditCard className="h-5 w-5" />
            </motion.div>
          </div>
          {/* orbiting sparks */}
          {[0, 1, 2].map((i) => (
            <motion.span
              key={i}
              className="absolute top-1/2 left-1/2 h-2 w-2 rounded-full bg-primary shadow-glow"
              animate={{
                x: Math.cos((i / 3) * Math.PI * 2) * 44,
                y: Math.sin((i / 3) * Math.PI * 2) * 44,
                opacity: [0.3, 1, 0.3],
              }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            />
          ))}
        </div>

        <h3 className="mt-5 font-display text-lg font-semibold">{label}</h3>

        {/* shimmering progress bar */}
        <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full w-1/3 rounded-full bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500"
            animate={{ x: ["-120%", "320%"] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <ul className="mt-5 space-y-1.5 text-left text-xs text-muted-foreground">
          {[
            { icon: Shield, text: "Securing your transaction" },
            { icon: Check, text: "Validating wallet & coupon" },
            { icon: Sparkles, text: "Activating your enrollments" },
          ].map((step, i) => (
            <motion.li
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.18 }}
              className="flex items-center gap-2"
            >
              <step.icon className="h-3.5 w-3.5 text-primary" />
              {step.text}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
