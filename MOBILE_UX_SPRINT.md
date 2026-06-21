# Learnify AI - Mobile UI/UX & Functional Fix Sprint

You are a Senior Staff Frontend Engineer, UX Designer, React/Next.js Expert and QA Engineer.

## IMPORTANT RULES

- DO NOT remove any feature.
- DO NOT change business logic.
- DO NOT break existing APIs.
- DO NOT change database schema unless required.
- Only improve UI, responsiveness, error handling and UX.
- Everything must work perfectly on:
  - Android
  - iPhone
  - Tablet
  - Desktop

---

## 1. MOBILE RESPONSIVENESS
Many pages overflow horizontally. Fix ALL responsive issues.
Use: `max-width`, `min-width`, `flex-wrap`, `overflow-hidden`, `overflow-auto`, `grid responsive`, Tailwind responsive breakpoints.
Every page should fit inside mobile width. No horizontal scrolling. Buttons should wrap automatically. Cards should resize. Long text should truncate properly.

## 2. CONTENT MANAGER PAGE
**Current issues:** Coupon button overlaps. Cards overflow. Tabs not aligned. Spacing inconsistent.
**Fix:** Responsive toolbar, Wrap buttons, Equal spacing, Better card layout, Better coupon table, Mobile friendly inputs, Sticky top actions.

## 3. COURSE PAGE
**Tabs:** Notes, Summary, Ask AI, Exercise, Playground currently overflow.
**Convert into:** Horizontal scroll pills OR Responsive segmented control.
Mark Complete button should resize. Lesson card should never overflow.

## 4. SUPPORT CHAT WIDGET
Current support bubble blocks buttons, forms, comments, inputs, floating actions.
**Requirements:** Automatically detect overlapping UI. Move widget dynamically. Allow minimize. Allow hide. Remember position. Snap to screen edges. Keep safe margin.
**Never cover:** Bottom Navigation, Buttons, Forms, Text inputs, Comments, CTA buttons, Video controls.

## 5. OPENROUTER ERROR HANDLING
**Current:** OpenRouter has no working free model.
**Instead implement:** Professional retry system.
If model unavailable, Automatically try: Model 1 → Model 2 → Model 3 → Model 4 → Paid model (if enabled).
If all fail, Show: "No AI models are currently available. Please try again later."
Add: Retry, Refresh, Status, Report issue. Never expose raw API errors.

## 6. COUPON MANAGEMENT
Improve cards. Proper columns: Coupon, Discount, Usage, Expiry, Status, Actions. Responsive table.

## 7. TYPOGRAPHY
Fix: Heading spacing, Button alignment, Icon sizes, Font weights, Card padding, Margins.

## 8. BUTTONS
Every button: Same height, Same radius, Same shadow, Same animation, Same spacing, Loading state, Disabled state, Success state.

## 9. INPUTS
Uniform inputs: Responsive, Proper labels, Validation, Character counters, Error messages, Focus animation.

## 10. PLAYGROUND
Fix responsive layout. Editor, Console, Preview, AI Assistant must work on mobile.
Use: Resizable panels, Collapsible AI panel, Fullscreen editor.

## 11. COMMENTS
Comment input hidden behind support widget. Fix. Responsive. Auto expand. Emoji support. Markdown support.

## 12. CARDS
Every card: Equal padding, Equal border radius, Equal shadow, Equal spacing, Responsive.

## 13. LOADING
Replace blank loading with: Skeleton UI, Progress animation, Placeholder cards.

## 14. EMPTY STATES
Instead of blank, show: Illustration, Helpful text, Primary action.

## 15. SUCCESS STATES
Add professional: Success toast, Confetti (where needed), Animation.

## 16. ERROR STATES
Replace raw errors. Friendly UI. Examples: AI unavailable, Network error, Payment failed, Upload failed, Video unavailable, Certificate unavailable.

## 17. ACCESSIBILITY
Keyboard navigation, ARIA labels, Screen reader support, Focus rings, Contrast improvements.

## 18. PERFORMANCE
Lazy load: Images, Videos, AI, Heavy components. Dynamic imports, Memoization, Reduce bundle size.

## 19. MOBILE TESTING
Test: 320px, 360px, 375px, 390px, 412px, 768px, 1024px, 1440px. No overflow.

## 20. FINAL QA
Automatically test every page. Find: Overflow, Broken layouts, Broken buttons, Missing icons, Broken links, Broken API calls, Missing loading, Console errors, Hydration errors, Accessibility issues, Responsive issues, Animation issues, Memory leaks, Unused imports, Unused files, Unused components, Broken routes.

## 21. FINAL REPORT
Generate:
- ✅ Fixed Issues
- ✅ Remaining Issues
- ✅ Performance Score
- ✅ Accessibility Score
- ✅ Mobile Score
- ✅ Desktop Score
- ✅ SEO Score
- ✅ Security Review
- ✅ API Health
- ✅ UI Consistency
- ✅ Responsive Status
- ✅ Pages Tested
- ✅ Components Tested
- ✅ Errors Fixed

Do not stop until every page is responsive, polished, production-ready, and no UI element overlaps or overflows on mobile.
