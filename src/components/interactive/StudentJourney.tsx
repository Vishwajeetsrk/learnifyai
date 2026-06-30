import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Join Free", icon: "1" },
  { label: "Complete Courses", icon: "2" },
  { label: "Build Resume", icon: "3" },
  { label: "Pass ATS", icon: "4" },
  { label: "Practice Interviews", icon: "5" },
  { label: "Get Internship", icon: "6" },
  { label: "Get Hired", icon: "7" },
];

export function StudentJourney() {
  return (
    <section className="container mx-auto px-6 py-16 md:py-20 max-w-5xl">
      <motion.div
        className="text-center mb-12"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Your Journey To Getting Hired</h2>
        <p className="mt-3 text-muted-foreground">From zero experience to career ready — all in one platform.</p>
      </motion.div>

      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-6 sm:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary/20 via-primary/40 to-primary/20 -translate-x-1/2" />

        <div className="space-y-8 relative">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.label}
              className={cn(
                "flex items-center gap-6",
                i % 2 === 0 ? "sm:flex-row" : "sm:flex-row-reverse",
              )}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="hidden sm:block flex-1" />

              {/* Circle node */}
              <div className="relative z-10 shrink-0">
                <motion.div
                  className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-primary/25"
                  whileHover={{ scale: 1.15 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {step.icon}
                </motion.div>
              </div>

              {/* Label */}
              <div
                className={cn(
                  "flex-1 text-left",
                  i % 2 !== 0 && "sm:text-right",
                )}
              >
                <motion.div
                  className="inline-block rounded-xl border bg-card px-5 py-3 shadow-sm"
                  whileHover={{ y: -2 }}
                >
                  <span className="text-sm font-semibold">{step.label}</span>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
