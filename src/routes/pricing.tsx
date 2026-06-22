import { createFileRoute, Link, useNavigate, useSearch } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import {
  Check,
  Loader2,
  LogIn,
  Zap,
  Users,
  Rocket,
  ArrowRight,
  Sparkles,
  Star,
  X,
  Crown,
  Shield,
  Globe,
  Cpu,
  TrendingUp,
  CreditCard,
  ChevronDown,
} from "lucide-react";
import { toast } from "sonner";
import { MarketingPage } from "@/components/MarketingPage";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { useServerFn } from "@tanstack/react-start";
import { createSubscription, cancelSubscription } from "@/lib/subscription.functions";

export const Route = createFileRoute("/pricing")({
  validateSearch: (s: Record<string, unknown>) => ({
    subscribe: s.subscribe as string | undefined,
  }),
  head: () => ({
    meta: [
      { title: "Pricing — Learnify AI" },
      {
        name: "description",
        content: "Simple, transparent pricing. Start free, upgrade when you're ready.",
      },
      { property: "og:title", content: "Pricing — Learnify AI" },
      {
        property: "og:description",
        content: "Free forever core. Pro and Team plans for serious learners and creators.",
      },
    ],
  }),
  component: PricingPage,
});

type Plan = {
  id: string;
  name: string;
  price_label: string;
  description: string | null;
  features: string[];
  cta_label: string;
  cta_to: string;
  highlighted: boolean;
  price_inr: number;
  interval: string | null;
  badge: string | null;
  color: string | null;
  ai_credits_monthly: number;
  max_courses: number;
  cashfree_plan_id: string | null;
};

const PLAN_ICONS = [Zap, Rocket, Users];

const FEATURE_COMPARISON = [
  { name: "AI Credits/month", starter: "500", pro: "10,000", team: "50,000", icon: Cpu },
  { name: "Courses", starter: "3 free", pro: "Unlimited", team: "Unlimited", icon: Globe },
  { name: "AI Tutor", starter: "Basic", pro: "Advanced", team: "Advanced", icon: Sparkles },
  { name: "Certificates", starter: "Basic", pro: "All", team: "All", icon: Shield },
  { name: "Creator Tools", starter: false, pro: true, team: true, icon: TrendingUp },
  { name: "Priority Support", starter: false, pro: true, team: true, icon: Star },
  { name: "Admin Dashboard", starter: false, pro: false, team: true, icon: Crown },
  { name: "Team Management", starter: false, pro: false, team: true, icon: Users },
  { name: "SSO + RBAC", starter: false, pro: false, team: true, icon: Shield },
  { name: "Custom Branding", starter: false, pro: false, team: true, icon: Sparkles },
  { name: "Dedicated Support", starter: false, pro: false, team: true, icon: Star },
  { name: "Community Access", starter: true, pro: true, team: true, icon: Users },
  { name: "Progress Tracking", starter: true, pro: true, team: true, icon: TrendingUp },
  { name: "Download Resources", starter: false, pro: true, team: true, icon: TrendingUp },
  { name: "Advanced Analytics", starter: false, pro: true, team: true, icon: TrendingUp },
  { name: "API Access", starter: false, pro: false, team: true, icon: Cpu },
];

const FAQ_ITEMS = [
  {
    q: "Can I switch plans anytime?",
    a: "Yes! Upgrade or downgrade anytime. When you upgrade, you get immediate access. Downgrades take effect at the end of your billing cycle.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept UPI, credit/debit cards, net banking, and wallets through Cashfree — India's most trusted payment gateway.",
  },
  {
    q: "Is there a free trial?",
    a: "All paid plans come with a 7-day free trial. No credit card required for the Starter plan — ever.",
  },
  {
    q: "What happens to my data if I cancel?",
    a: "Your data stays safe for 90 days after cancellation. You can re-subscribe anytime to restore everything instantly.",
  },
];

function PricingPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const { subscribe } = useSearch({ from: "/pricing" });
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const doSubscribe = useServerFn(createSubscription);
  const doCancel = useServerFn(cancelSubscription);
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  useEffect(() => {
    if (subscribe === "ok") {
      toast.success("Subscription successful! Welcome aboard.");
      navigate({ to: "/pricing", search: { subscribe: undefined }, replace: true });
      qc.invalidateQueries({ queryKey: ["user-subscription"] });
    }
  }, [subscribe]);

  const {
    data: tiers,
    isLoading,
    error,
  } = useQuery<Plan[]>({
    queryKey: ["pricing-plans"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("pricing_plans")
        .select("*")
        .eq("active", true)
        .order("order_index", { ascending: true });
      if (error) throw error;
      return ((data ?? []) as any[]).map((p) => ({
        ...p,
        features: Array.isArray(p.features) ? p.features : [],
        price_inr: Number(p.price_inr || 0),
        max_courses: Number(p.max_courses ?? -1),
        ai_credits_monthly: Number(p.ai_credits_monthly || 0),
      })) as Plan[];
    },
    retry: 2,
    staleTime: 60_000,
  });

  const currentSub = useQuery({
    enabled: !!user,
    queryKey: ["my-subscription", user?.id],
    queryFn: async () => {
      const { data } = await (supabase as any)
        .from("user_subscriptions")
        .select("*, plan:pricing_plans(*)")
        .eq("user_id", user!.id)
        .eq("status", "active")
        .maybeSingle();
      return data || null;
    },
  });

  const handleSubscribe = async (planId: string) => {
    if (!user) {
      navigate({ to: "/login" });
      return;
    }
    setLoadingPlan(planId);
    try {
      const sub = await doSubscribe({ data: { planId } });
      if (sub.free) {
        toast.success("Free plan activated! Welcome to Learnify AI.");
        qc.invalidateQueries({ queryKey: ["my-subscription"] });
      } else if (sub.auth_link) {
        window.location.href = sub.auth_link;
      } else {
        toast.success("Subscription created! Check your dashboard.");
        qc.invalidateQueries({ queryKey: ["my-subscription"] });
      }
    } catch (e: any) {
      toast.error(e?.message || "Subscription failed");
    } finally {
      setLoadingPlan(null);
    }
  };

  const handleCancel = async () => {
    try {
      await doCancel({ data: {} });
      toast.success("Subscription cancelled");
      qc.invalidateQueries({ queryKey: ["my-subscription"] });
    } catch (e: any) {
      toast.error(e?.message || "Cancel failed");
    }
  };

  const activePlanId = currentSub.data?.plan_id;

  return (
    <MarketingPage
      eyebrow="Pricing"
      title="Simple pricing. Real value."
      subtitle="Start free. Upgrade when Learnify becomes part of your routine."
    >
      {/* Animated background orbs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-primary/5 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-purple-500/5 blur-3xl"
          animate={{ x: [0, -30, 0], y: [0, 20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      {/* Trust badges with stagger animation */}
      <motion.div
        ref={heroRef}
        className="flex flex-wrap justify-center gap-6 mb-12 text-sm text-muted-foreground"
        initial={{ opacity: 0, y: 20 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { icon: Star, label: "No hidden fees" },
          { icon: Sparkles, label: "Cancel anytime" },
          { icon: Check, label: "Instant access" },
        ].map(({ icon: Icon, label }, i) => (
          <motion.div
            key={label}
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
          >
            <Icon className="h-4 w-4 text-primary" />
            <span>{label}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Billing toggle */}
      <motion.div
        className="flex justify-center mb-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={heroInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="inline-flex items-center gap-3 bg-card border rounded-full p-1.5 shadow-sm">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
              billingCycle === "monthly"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 relative ${
              billingCycle === "yearly"
                ? "bg-primary text-primary-foreground shadow-md"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Yearly
            <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              -20%
            </span>
          </button>
        </div>
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="space-y-3 rounded-3xl border border-destructive/20 bg-destructive/5 p-10 text-center">
          <p className="text-lg font-semibold text-destructive">Pricing is currently unavailable.</p>
          <p className="text-sm text-muted-foreground">
            We couldn&apos;t load the pricing details right now. Please refresh or try again later.
          </p>
        </div>
      ) : !tiers || tiers.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">Pricing coming soon.</p>
      ) : (
        <>
          {/* 3D Pricing cards */}
          <div className="grid md:grid-cols-3 gap-6 lg:gap-8 items-stretch perspective-[1200px]">
            {tiers.map((t, idx) => {
              const isCurrent = activePlanId === t.id;
              const isFree = t.price_inr <= 0 && !t.interval;
              const hasPrice = t.price_inr > 0;
              const PlanIcon = PLAN_ICONS[idx] ?? Zap;
              const accentColor = t.color || "#7c3aed";
              const isPopular = t.highlighted;

              return (
                <PricingCard
                  key={t.id}
                  plan={t}
                  idx={idx}
                  isCurrent={isCurrent}
                  isFree={isFree}
                  hasPrice={hasPrice}
                  PlanIcon={PlanIcon}
                  accentColor={accentColor}
                  isPopular={isPopular}
                  billingCycle={billingCycle}
                  loadingPlan={loadingPlan}
                  onSubscribe={handleSubscribe}
                  onCancel={handleCancel}
                />
              );
            })}
          </div>

          {/* Feature Comparison Table */}
          <motion.div
            className="mt-20 rounded-2xl border bg-card overflow-hidden"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7 }}
          >
            <div className="p-6 border-b text-center">
              <h3 className="text-xl font-bold">Compare Plans</h3>
              <p className="text-sm text-muted-foreground mt-1">
                See what&apos;s included in each plan
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-4 font-medium text-muted-foreground w-1/4">
                      Feature
                    </th>
                    {tiers.map((t) => (
                      <th key={t.id} className="text-center p-4 font-semibold">
                        {t.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FEATURE_COMPARISON.map((feature, idx) => (
                    <motion.tr
                      key={idx}
                      className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: idx * 0.03 }}
                    >
                      <td className="p-4 text-foreground/80 flex items-center gap-2">
                        <feature.icon className="h-4 w-4 text-primary/60" />
                        {feature.name}
                      </td>
                      <td className="text-center p-4">{renderFeatureValue(feature.starter)}</td>
                      <td className="text-center p-4">{renderFeatureValue(feature.pro)}</td>
                      <td className="text-center p-4">{renderFeatureValue(feature.team)}</td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="mt-20 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.6 }}
          >
            <h3 className="text-xl font-bold text-center mb-8">
              Frequently Asked Questions
            </h3>
            <div className="space-y-3">
              {FAQ_ITEMS.map((item, i) => (
                <motion.div
                  key={i}
                  className="border rounded-xl overflow-hidden bg-card"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left font-medium hover:bg-muted/30 transition-colors"
                  >
                    <span>{item.q}</span>
                    <motion.div
                      animate={{ rotate: openFaq === i ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <p className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Reassurance strip */}
          <motion.div
            className="mt-16 rounded-2xl border border-border/50 bg-muted/30 px-8 py-7 text-center space-y-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <CreditCard className="h-5 w-5 text-primary" />
              <span className="text-sm font-semibold">Secure payments powered by Cashfree</span>
            </div>
            <p className="text-sm text-muted-foreground">
              All plans include a 7-day trial. No credit card required for Starter.{" "}
              <a
                href="mailto:hello@learnify.ai"
                className="text-primary underline underline-offset-2 hover:opacity-80 transition"
              >
                Contact us
              </a>{" "}
              anytime.
            </p>
          </motion.div>
        </>
      )}
    </MarketingPage>
  );
}

function PricingCard({
  plan,
  idx,
  isCurrent,
  isFree,
  hasPrice,
  PlanIcon,
  accentColor,
  isPopular,
  billingCycle,
  loadingPlan,
  onSubscribe,
  onCancel,
}: {
  plan: Plan;
  idx: number;
  isCurrent: boolean;
  isFree: boolean;
  hasPrice: boolean;
  PlanIcon: any;
  accentColor: string;
  isPopular: boolean;
  billingCycle: "monthly" | "yearly";
  loadingPlan: string | null;
  onSubscribe: (id: string) => void;
  onCancel: () => void;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    setRotate({
      x: -(y - centerY) / 20,
      y: (x - centerX) / 20,
    });
  };

  const handleMouseLeave = () => {
    setRotate({ x: 0, y: 0 });
    setIsHovered(false);
  };

  const yearlyPrice = Math.round(plan.price_inr * 12 * 0.8);
  const basePrice = plan.price_label.replace(/\/mo(nth)?$/i, "").trim();
  const displayPrice =
    billingCycle === "yearly" && hasPrice
      ? `₹${yearlyPrice.toLocaleString("en-IN")}`
      : basePrice;

  return (
    <motion.div
      ref={cardRef}
      className="relative flex flex-col"
      style={{
        transformStyle: "preserve-3d",
      }}
      initial={{ opacity: 0, y: 60, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: idx * 0.15, ease: "easeOut" }}
      animate={{
        rotateX: rotate.x,
        rotateY: rotate.y,
        scale: isHovered ? 1.02 : 1,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute -inset-1 rounded-3xl opacity-0 blur-xl transition-opacity duration-500 pointer-events-none"
        style={{ background: `linear-gradient(135deg, ${accentColor}30, ${accentColor}10)` }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      <div
        className={`relative rounded-3xl flex flex-col overflow-hidden transition-shadow duration-300 ${
          isPopular
            ? "shadow-2xl shadow-violet-500/20 border-2"
            : "border hover:shadow-xl hover:shadow-black/10"
        }`}
        style={{
          borderColor: isPopular ? accentColor : undefined,
          background: "hsl(var(--card))",
          transform: "translateZ(20px)",
        }}
      >
        {/* Gradient top bar with shimmer */}
        <div className="relative h-1.5 w-full overflow-hidden">
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(90deg, ${accentColor}, ${accentColor}cc, ${accentColor})`,
            }}
          />
          {isPopular && (
            <motion.div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)`,
              }}
              animate={{ x: ["-100%", "200%"] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut", repeatDelay: 3 }}
            />
          )}
        </div>

        {/* Popular badge */}
        {(plan.badge || isCurrent) && (
          <motion.div
            className="absolute top-5 right-5 text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full text-white shadow-lg"
            style={{ background: accentColor }}
            initial={{ scale: 0, rotate: -12 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 15, delay: 0.3 + idx * 0.1 }}
          >
            {isCurrent ? "Your plan" : plan.badge}
          </motion.div>
        )}

        <div className="flex flex-col flex-1 p-8">
          {/* Icon + Name */}
          <motion.div
            className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5 shadow-md"
            style={{ background: `${accentColor}20` }}
            whileHover={{ rotate: [0, -10, 10, -5, 0], scale: 1.1 }}
            transition={{ duration: 0.5 }}
          >
            <PlanIcon className="h-6 w-6" style={{ color: accentColor }} />
          </motion.div>

          <h3 className="text-xl font-bold">{plan.name}</h3>
          {plan.description && (
            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
              {plan.description}
            </p>
          )}

          {/* Price */}
          <div className="mt-6 mb-1 flex items-baseline gap-1">
            <motion.span
              className="text-4xl sm:text-5xl font-extrabold tracking-tight"
              key={displayPrice}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {displayPrice}
            </motion.span>
            {hasPrice && plan.interval && (
              <span className="text-sm text-muted-foreground">
                /{billingCycle === "yearly" ? "year" : plan.interval}
              </span>
            )}
          </div>

          {billingCycle === "yearly" && hasPrice && (
            <motion.p
              className="text-xs text-emerald-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              Save ₹{((plan.price_inr * 12) - yearlyPrice).toLocaleString("en-IN")}/year
            </motion.p>
          )}

          {/* AI Credits */}
          {plan.ai_credits_monthly > 0 && (
            <motion.div
              className="my-4 px-4 py-2.5 rounded-xl border text-center relative overflow-hidden"
              style={{ background: `${accentColor}08`, borderColor: `${accentColor}15` }}
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-sm font-semibold" style={{ color: accentColor }}>
                {plan.ai_credits_monthly.toLocaleString("en-IN")} AI credits / month
              </span>
            </motion.div>
          )}

          {/* Divider */}
          <div className="border-t border-border/40 my-5" />

          {/* Features */}
          <ul className="space-y-3 text-sm flex-1">
            {plan.features.map((f, i) => (
              <motion.li
                key={i}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
              >
                <motion.div
                  className="mt-0.5 h-5 w-5 rounded-full flex items-center justify-center shrink-0"
                  style={{ background: `${accentColor}18` }}
                  whileHover={{ scale: 1.3, rotate: 360 }}
                  transition={{ duration: 0.3 }}
                >
                  <Check className="h-3 w-3" style={{ color: accentColor }} />
                </motion.div>
                <span className="text-foreground/80">{f}</span>
              </motion.li>
            ))}
          </ul>

          {/* CTA */}
          <div className="mt-8 space-y-2">
            {isCurrent ? (
              <div className="flex gap-2">
                <Button className="flex-1" variant="outline" disabled>
                  <Crown className="h-4 w-4 mr-2" />
                  Current plan
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCancel}
                  className="text-muted-foreground"
                >
                  Cancel
                </Button>
              </div>
            ) : !hasPrice ? (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  asChild
                  className="w-full h-12 text-sm font-semibold shadow-lg"
                  variant={isPopular ? "default" : "outline"}
                  style={
                    isPopular
                      ? { background: accentColor, color: "#fff", border: "none" }
                      : undefined
                  }
                >
                  <Link to="/signup">
                    {plan.cta_label || "Get started free"}
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </motion.div>
            ) : (
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Button
                  className="w-full h-12 text-sm font-semibold shadow-lg"
                  onClick={() => onSubscribe(plan.id)}
                  disabled={loadingPlan !== null}
                  style={
                    isPopular
                      ? { background: accentColor, color: "#fff", border: "none" }
                      : undefined
                  }
                >
                  {loadingPlan === plan.id ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CreditCard className="h-4 w-4 mr-2" />
                  )}
                  {loadingPlan === plan.id
                    ? "Processing..."
                    : plan.cta_label || `Subscribe ${displayPrice}`}
                </Button>
              </motion.div>
            )}
          </div>

          {hasPrice && (
            <div className="mt-4 text-center">
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider flex items-center justify-center gap-1.5">
                <Check className="h-3 w-3 text-emerald-500" /> Securely processed by Cashfree
              </span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function renderFeatureValue(value: boolean | string) {
  if (typeof value === "boolean") {
    return value ? (
      <motion.div
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ type: "spring", stiffness: 500, damping: 15 }}
      >
        <Check className="h-5 w-5 text-emerald-500 mx-auto" />
      </motion.div>
    ) : (
      <X className="h-5 w-5 text-zinc-400 mx-auto" />
    );
  }
  return <span className="text-foreground font-medium">{value}</span>;
}
