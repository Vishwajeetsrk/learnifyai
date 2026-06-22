import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie } from "lucide-react";

const COOKIE_CONSENT_KEY = "learnify_cookie_consent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(COOKIE_CONSENT_KEY)) {
        setVisible(true);
      }
    } catch {
      // localStorage unavailable — show banner anyway
      setVisible(true);
    }
  }, []);

  const accept = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "accepted");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  const reject = () => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, "rejected");
    } catch {
      // ignore
    }
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-6"
        >
          <div className="mx-auto max-w-2xl rounded-2xl border bg-card shadow-2xl p-5 sm:p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 h-10 w-10 rounded-xl bg-primary/10 grid place-items-center">
                <Cookie className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display font-semibold text-sm">We value your privacy</h3>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  We use cookies to enhance your experience, analyze site traffic, and personalize
                  content. By clicking "Accept", you consent to our use of cookies. You can manage
                  your preferences anytime in settings.
                </p>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <Button size="sm" onClick={accept} className="rounded-full">
                    Accept all
                  </Button>
                  <Button size="sm" variant="outline" onClick={reject} className="rounded-full">
                    Reject non-essential
                  </Button>
                  <Link
                    to="/privacy"
                    className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 ml-1"
                  >
                    Privacy policy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
