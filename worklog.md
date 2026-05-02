---
Task ID: 1
Agent: Main Agent
Task: Remove dark mode system from the project

Work Log:
- Read all 4 source files to identify dark mode code locations
- Removed `[data-theme="dark"]` CSS variable overrides block (lines 99-136)
- Removed `body.dark-transition` smooth theme transition block (lines 138-148)
- Removed all `[data-theme="dark"]` card glass adjustments (lines 748-765)
- Removed `.theme-toggle` button styles (lines 908-932)
- Removed entire "DARK MODE SPECIFIC OVERRIDES" section (lines 934-1016)
- Updated sound-toggle position from `calc(var(--space-5) + 66px)` to `var(--space-5)`
- Updated print styles to remove `.theme-toggle` reference
- Updated responsive styles to remove `.theme-toggle` reference
- Removed dark mode toggle button JSX from page.tsx
- Removed FOUC prevention script from layout.tsx
- Removed entire `toggleTheme` function and dark mode IIFE from web-portal.js
- Removed `.theme-toggle` from ripple effect listener
- Built successfully, verified zero dark mode remnants

Stage Summary:
- Dark mode system completely removed from all files
- Sound toggle repositioned to top-right (was offset 66px for theme toggle)
- Build passes cleanly
- Files modified: src/app/page.tsx, src/app/layout.tsx, src/app/web-portal.css, public/web-portal.js
