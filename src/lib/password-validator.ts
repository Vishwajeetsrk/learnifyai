export const validatePasswordStrength = (password: string): { isValid: boolean; error?: string } => {
  const minLength = 12;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return { isValid: false, error: "Password must be at least 12 characters long." };
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
