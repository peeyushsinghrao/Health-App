---
Task ID: 1
Agent: Main Agent
Task: Build interactive web preview of the Health App (AHWC Flutter + Web Portal)

Work Log:
- Cloned the repository https://github.com/peeyushsinghrao/Health-App.git
- Read and analyzed all source files: Flutter mobile app (Dart), Web Portal (HTML/CSS/JS)
- Identified app structure: Splash Screen, Home Screen, PLP Report Form, Staff Attendance Form
- Built comprehensive Next.js preview app replicating the Flutter mobile app UI
- Created all screens: Splash, Home (with AHWC header, quick stats, hero cards, coming soon, bottom nav), Report (PLP form), Attendance
- Verified dev server running and page compiled successfully (200 OK)

Stage Summary:
- Complete interactive preview built at /home/z/my-project/src/app/page.tsx
- Faithful recreation of Flutter app UI with Framer Motion animations
- Phone frame wrapper for realistic mobile preview
- All navigation between screens working
- Live calculations for PLP report (percentages, amounts, payments)
- Attendance table with date-based tracking and casual leave counting
- Document preview for attendance sheets
