/**
 * Learnify AI — Password Security & Leaked Password Protection
 * Integrates HaveIBeenPwned (HIBP) k-Anonymity API to prevent use of compromised passwords.
 */

export const validatePasswordStrength = (
  password: string,
): { isValid: boolean; error?: string } => {
  const minLength = 10;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return { isValid: false, error: "Password must be at least 10 characters long." };
  }
  if (!hasUpperCase || !hasLowerCase) {
    return { isValid: false, error: "Password must contain both uppercase and lowercase letters." };
  }
  if (!hasNumber) {
    return { isValid: false, error: "Password must contain at least one digit." };
  }
  if (!hasSpecialChar) {
    return { isValid: false, error: "Password must contain at least one special character." };
  }
  return { isValid: true };
};

/**
 * Checks HaveIBeenPwned k-Anonymity API to see if the password has been exposed in data breaches.
 * The full password or full hash is NEVER sent over the wire (only the 5-char SHA-1 prefix).
 */
export async function checkPwnedPassword(
  password: string,
): Promise<{ isPwned: boolean; breachCount: number; error?: string }> {
  try {
    if (!password || password.length === 0) {
      return { isPwned: false, breachCount: 0 };
    }

    // Compute SHA-1 hash via standard Web Crypto API
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-1", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").toUpperCase();

    const prefix = hashHex.slice(0, 5);
    const suffix = hashHex.slice(5);

    // Call HaveIBeenPwned Range API with 2.5s timeout so signup is never blocked if network stalls
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);

    const res = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
      method: "GET",
      signal: controller.signal,
      headers: {
        "Add-Padding": "true", // HIBP privacy padding
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) {
      return { isPwned: false, breachCount: 0 };
    }

    const text = await res.text();
    const lines = text.split("\n");

    for (const line of lines) {
      const [hashSuffix, countStr] = line.trim().split(":");
      if (hashSuffix && hashSuffix.toUpperCase() === suffix) {
        const breachCount = parseInt(countStr || "1", 10);
        return {
          isPwned: true,
          breachCount,
          error: `This password has appeared in ${breachCount.toLocaleString()} known data breaches. Please choose a different password for your safety.`,
        };
      }
    }

    return { isPwned: false, breachCount: 0 };
  } catch (err) {
    // If HIBP is unreachable, don't hard block user signup
    console.warn("HaveIBeenPwned check bypassed due to network/timeout:", err);
    return { isPwned: false, breachCount: 0 };
  }
}

/**
 * Combined validator: checks password complexity AND HaveIBeenPwned breach database.
 */
export async function validatePasswordSecurity(
  password: string,
): Promise<{ isValid: boolean; error?: string; breachCount?: number }> {
  const strength = validatePasswordStrength(password);
  if (!strength.isValid) {
    return strength;
  }

  const pwned = await checkPwnedPassword(password);
  if (pwned.isPwned) {
    return {
      isValid: false,
      error: pwned.error || "This password was found in public data breaches.",
      breachCount: pwned.breachCount,
    };
  }

  return { isValid: true };
}

