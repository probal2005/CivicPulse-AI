# CivicPulse AI — Master Development Prompt

> Version: 1.0
> Project: CivicPulse AI
> Team: Pie-3.1416
> Tagline: HACK • BUILD • INNOVATE
> Repository: https://github.com/probal2005/CivicPulse-AI
> Live Frontend: https://civicpulseai-ten.vercel.app

---

# 1. ROLE

You are the lead full-stack engineer, UI/UX engineer, product architect, database engineer, security engineer, and QA engineer working on the existing **CivicPulse AI** project.

You are NOT creating a random new project.

You are continuing and improving an existing application.

Your first priority is to understand the existing codebase and preserve existing functionality.

Do NOT unnecessarily replace working code.

Do NOT delete existing pages, components, routes, services, database logic, styles, assets, or features.

Before making a major change:

1. Inspect the existing implementation.
2. Understand its dependencies.
3. Reuse existing components where possible.
4. Preserve working functionality.
5. Make changes incrementally.
6. Verify the application after every major change.

---

# 2. PROJECT VISION

CivicPulse AI is a modern civic technology platform that allows citizens to report, visualize, track, and manage civic issues.

The platform should create a complete civic issue lifecycle:

Citizen
    ↓
Discover Problem
    ↓
Report Problem
    ↓
Capture Location
    ↓
Store Structured Data
    ↓
Administrative Review
    ↓
Priority Assignment
    ↓
Response Team Assignment
    ↓
Progress Tracking
    ↓
Resolution
    ↓
Civic Analytics

The platform should feel like a serious production-grade civic technology product rather than a simple university CRUD application.

---

# 3. PRIMARY PRODUCT GOAL

Build a unified platform for:

- Civic issue reporting
- Issue tracking
- Geographic visualization
- Citizen dashboards
- Administrative management
- Civic analytics
- User profiles
- Community transparency
- Responsive access
- Accessible interface
- Future intelligent civic analysis

The application should be:

- Functional
- Responsive
- Secure
- Maintainable
- Scalable
- Visually polished
- Accessible
- Data-driven
- Mobile friendly
- Production oriented

---

# 4. IMPORTANT DEVELOPMENT PRIORITY

The project must be developed in the following order.

## PHASE 1 — CORE PLATFORM

Complete and stabilize:

- Landing page
- Authentication
- Citizen dashboard
- Complaint reporting
- Complaint management
- Supabase integration
- Profile
- Civic map
- Geolocation
- Admin dashboard
- Team page
- Notifications
- Theme system
- Responsive UI
- Error states
- Loading states
- Empty states
- Security
- Database integrity

## PHASE 2 — CIVIC ANALYTICS

Implement:

- Issue statistics
- Category analytics
- Status analytics
- Priority analytics
- Geographic hotspots
- Resolution trends
- Administrative reporting
- Civic data visualization

## PHASE 3 — IMAGE INTELLIGENCE

Implement real image intelligence only when an actual model/backend exists.

Possible capabilities:

- Image classification
- Civic issue category detection
- Severity estimation
- Infrastructure damage recognition
- Waste detection
- Waterlogging detection
- Streetlight detection

NEVER present simulated/random results as real AI.

## PHASE 4 — AI ASSISTANT

ONLY AFTER THE CORE PLATFORM IS COMPLETE.

Do NOT prioritize:

- Gemini chat
- AI assistant
- conversational AI
- FastAPI AI service
- AI chatbot UI

until the core platform is stable.

The AI Assistant is the FINAL major development phase.

---

# 5. CRITICAL RULE — NO FAKE FEATURES

Never create fake functionality just to make the interface look complete.

Forbidden:

```text
Fake AI response
Random AI confidence
Fake database statistics
Fake complaint status
Fake location
Fake admin action
Fake notification
Fake API response
Fake success message
Fake backend request
````

If a feature is not connected to a real backend:

Clearly label it as:

* Coming Soon
* Not Connected
* Preview
* Development Feature

Do not call it production functionality.

---

# 6. EXISTING TECHNOLOGY STACK

Use the existing stack unless there is a strong technical reason to change it.

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* React Router
* Lucide React

## Backend / Data

* Supabase
* PostgreSQL
* Supabase Auth
* Row-Level Security

## Maps

* Leaflet
* React Leaflet
* OpenStreetMap
* Browser Geolocation API

## Deployment

* GitHub
* Vercel

Do not introduce unnecessary frameworks.

---

# 7. EXISTING ROUTES

Preserve the existing routing architecture.

Current conceptual routes:

```text
/
├── LandingPage
│
├── /auth
│   └── AuthPage
│
├── /dashboard
│   └── CitizenDashboard
│
├── /report
│   └── ReportIssuePage
│
├── /admin
│   └── AdminCommandCenter
│
├── /profile
│   └── ProfilePage
│
├── /map
│   └── CivicMapPage
│
├── /ai
│   └── AIIntelligencePage
│
├── /team
│   └── TeamPage
│
└── *
    └── 404
```

Do not remove an existing route unless there is an explicit reason.

---

# 8. ROUTE ACCESS RULES

## Public routes

These should be accessible without authentication:

```text
/
 /auth
 /map
 /team
```

## Authenticated routes

Require login:

```text
/dashboard
/report
/profile
```

## Administrator routes

Require:

```ts
user?.app_metadata?.role === "admin"
```

Admin route:

```text
/admin
```

Unauthorized users must NOT be able to access administrative functionality simply by navigating to `/admin`.

---

# 9. AUTHENTICATION

Use Supabase Authentication.

Required functionality:

## Sign Up

Collect appropriate user information.

## Login

Allow authenticated users to log in.

## Logout

Destroy the authenticated session correctly.

## Session persistence

Users should remain logged in across refreshes where Supabase session behavior permits.

## Protected routes

Unauthenticated users should be redirected to:

```text
/auth
```

## Admin role

Use Supabase `app_metadata`.

Example:

```ts
const isAdmin =
  user?.app_metadata?.role === "admin";
```

Never store admin privileges only in localStorage.

Never trust frontend-only admin checks for sensitive database operations.

---

# 10. SECURITY RULES

NEVER:

* Hardcode passwords
* Hardcode API keys
* Commit `.env`
* Commit `.env.local`
* Expose Supabase service-role keys
* Store sensitive credentials in React code
* Trust frontend authorization alone
* Allow arbitrary users to modify another user's complaints
* Allow normal citizens to execute admin operations

Use:

* Supabase Auth
* Row-Level Security
* Environment variables
* Server-side validation
* Database policies
* App metadata for roles

---

# 11. ENVIRONMENT VARIABLES

Frontend should use:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
```

Never place:

```text
SUPABASE_SERVICE_ROLE_KEY
```

in frontend environment variables.

Never commit:

```text
.env
.env.local
```

to Git.

---

# 12. CIVIC ISSUE MODEL

The core entity is the civic complaint/issue.

Conceptual structure:

```ts
interface Complaint {
  id: string;

  title: string;

  category:
    | "pothole"
    | "garbage"
    | "waterlogging"
    | "streetlight"
    | "road_damage"
    | "other";

  description: string;

  status:
    | "submitted"
    | "under_review"
    | "assigned"
    | "resolved";

  priority:
    | "low"
    | "medium"
    | "high"
    | "critical";

  location: string;

  lat: number;

  lng: number;

  imageUrl?: string;

  reporterName: string;

  reporterContact: string;

  assignedTeam?: string;

  createdAt: string;

  updatedAt: string;
}
```

Preserve compatibility with the existing project's actual types.

Do not blindly overwrite existing types if they contain additional fields.

---

# 13. ISSUE CATEGORIES

Support:

```text
pothole
garbage
waterlogging
streetlight
road_damage
other
```

Each category should have:

* Label
* Icon
* Color
* Description
* Default priority
* Map representation

---

# 14. DEFAULT PRIORITY

Use sensible category-based defaults.

Suggested:

```text
Waterlogging → Critical
Pothole → High
Road Damage → High
Garbage → Medium
Streetlight → Low
Other → Low
```

This is an initial categorization only.

Administrators must be able to modify priority.

Do not imply that category automatically represents actual real-world severity in every case.

---

# 15. COMPLAINT STATUS

Use:

```text
Submitted
Under Review
Assigned
Resolved
```

The interface should visually communicate status.

Example:

```text
Submitted
   ↓
Under Review
   ↓
Assigned
   ↓
Resolved
```

Show timestamps when available.

Do not fabricate timestamps.

---

# 16. REPORT ISSUE PAGE

The report page must be a complete civic issue submission form.

Required fields:

### Title

Short and descriptive.

Example:

```text
Large pothole near university gate
```

### Category

Dropdown or visual category selector.

### Description

Detailed issue explanation.

### Location

Allow:

* Manual location
* Current location
* Map-based selection where supported

### Latitude

Store actual latitude.

### Longitude

Store actual longitude.

### Image

Allow image upload where supported.

### Priority

Use calculated initial priority but allow appropriate administrative handling later.

---

# 17. REPORT FORM UX

The report page should feel like a real product.

Use sections:

```text
1. Issue Information

2. Location

3. Evidence

4. Review

5. Submit
```

Provide:

* Validation
* Loading state
* Upload state
* Error state
* Success state
* Clear feedback

Never display success before the database confirms successful submission.

---

# 18. IMAGE UPLOAD

Images should be:

* Previewable
* Removable
* Validated
* Size controlled
* Type controlled

Allowed examples:

```text
image/jpeg
image/png
image/webp
```

Do not allow arbitrary dangerous file types.

If Supabase Storage is used:

```text
complaints/
  user-id/
    complaint-id/
      image.ext
```

Use secure access policies.

---

# 19. CITIZEN DASHBOARD

The citizen dashboard should provide a high-level overview.

Display:

```text
Total Reports
Pending Reports
High Priority
Resolved
```

Also display:

* Recent reports
* Status
* Priority
* Category
* Location
* Created date
* Quick actions

Quick actions:

```text
Report New Issue
View Civic Map
View My Reports
Open Profile
```

---

# 20. DASHBOARD DATA RULE

All dashboard statistics must come from real complaint data.

Never write:

```ts
const totalReports = 127;
```

unless it is explicitly mock/development data and clearly labeled.

Production statistics must be computed from Supabase/database data.

---

# 21. MY REPORTS

Citizens should be able to view only reports they are authorized to access.

Each report card should show:

```text
Title
Category
Status
Priority
Location
Date
```

Clicking a report should show detailed information.

---

# 22. PROFILE PAGE

Profile should contain:

* Name
* Email
* Account information
* Avatar where supported
* Joined date where available
* User's report summary
* Logout
* Account settings where implemented

Do not expose internal authentication metadata unnecessarily.

---

# 23. CIVIC MAP

The Civic Map is a core feature.

Use:

```text
Leaflet
React Leaflet
OpenStreetMap
Browser Geolocation
```

Features:

* Current location
* Live position
* Accuracy circle
* Recenter button
* Issue markers
* Category filtering
* Nearby issues
* Distance calculation
* Issue detail
* Map interaction
* Responsive layout

---

# 24. CURRENT LOCATION

Never hardcode a user's current location.

Use:

```ts
navigator.geolocation.getCurrentPosition()
```

and, where appropriate:

```ts
navigator.geolocation.watchPosition()
```

Use:

```text
enableHighAccuracy: true
```

where appropriate.

Handle:

```text
Permission denied
Location unavailable
Timeout
Browser unsupported
```

Do not silently fall back to a fake location.

---

# 25. MAP MARKERS

Each real complaint should be represented using:

```text
Latitude
Longitude
Category
Priority
Status
Title
```

Marker appearance may vary based on category/priority.

Clicking a marker should reveal useful information.

---

# 26. NEARBY ISSUE CALCULATION

When location permission is available:

Calculate approximate distance between:

```text
User location
      ↓
Complaint location
```

Display human-readable distances such as:

```text
350 m away
1.2 km away
4.8 km away
```

Do not claim precise distance beyond what the underlying coordinates support.

---

# 27. MAP FILTERS

Support filtering by:

### Category

```text
All
Potholes
Garbage
Waterlogging
Streetlights
Road Damage
Other
```

### Status

```text
All
Submitted
Under Review
Assigned
Resolved
```

### Priority

```text
All
Low
Medium
High
Critical
```

---

# 28. ADMIN COMMAND CENTER

The admin page should function as the operational control center.

Include:

```text
Overview
Complaints
Filters
Search
Statistics
Assignments
Status Management
Priority Management
```

---

# 29. ADMIN COMPLAINT TABLE

Display useful columns:

```text
ID
Issue
Category
Citizen
Location
Priority
Status
Created
Actions
```

Actions may include:

```text
View
Update Status
Change Priority
Assign Team
```

All actions must be backed by actual database operations.

---

# 30. ADMIN SEARCH

Search should support useful fields such as:

```text
Issue title
Complaint ID
Category
Citizen
Location
```

Search should be debounced if it triggers frequent backend requests.

---

# 31. ADMIN FILTERS

Provide:

```text
Category
Status
Priority
Date
Assigned Team
```

Allow filters to be combined.

Provide a clear/reset filters action.

---

# 32. ADMIN STATISTICS

Admin analytics may include:

```text
Total complaints
Submitted
Under review
Assigned
Resolved
Critical
High
Medium
Low
```

Future analytics:

```text
Complaints by category
Complaints by area
Resolution rate
Resolution time
Daily/weekly/monthly trends
Hotspot areas
```

---

# 33. TEAM ASSIGNMENT

Administrators should be able to assign complaints to response teams.

Example:

```text
Road Maintenance
Waste Management
Drainage Team
Electrical Team
General Infrastructure
```

Only use real team data if the database contains it.

Otherwise use a clearly defined configuration/data table rather than hardcoding arbitrary production records.

---

# 34. TEAM PAGE

The `/team` page represents the project team.

Team identity:

```text
Pie-3.1416

HACK • BUILD • INNOVATE
```

Team resources:

```text
GitHub:
https://github.com/Pie-3-1416

Website:
https://pie-3.1416.versel.app

Email:
team.pie3.141@proton.me
```

The page should include:

* Team logo
* Team name
* Team tagline
* Member cards
* Member image
* Name
* Role
* Short biography
* Skills
* GitHub
* LinkedIn
* Email

Do not invent team member information.

Use the actual provided assets/data.

---

# 35. BRANDING

Application name:

```text
CivicPulse AI
```

Tagline:

```text
Smarter Cities • Stronger Communities
```

Team:

```text
Pie-3.1416
```

Team tagline:

```text
HACK • BUILD • INNOVATE
```

---

# 36. LOGO

The primary logo asset should be stored under:

```text
public/images/
```

Example:

```text
public/images/civicpulse-icon.png
```

Browser path:

```text
/images/civicpulse-icon.png
```

NEVER use:

```text
/public/images/civicpulse-icon.png
```

because `/public` is not part of the public URL.

---

# 37. HEADER

The main header should contain:

```text
CivicPulse logo
Navigation
Theme switcher
Notification area
User menu
Admin indicator when applicable
```

Do not display an Admin badge for normal citizens.

Admin UI must depend on the actual authenticated role.

---

# 38. NAVIGATION

Suggested navigation:

```text
Home
Dashboard
Report Issue
Civic Map
Profile
Team
```

Admin users may additionally see:

```text
Admin Command Center
```

---

# 39. THEME SYSTEM

The entire application must support:

```text
civic
midnight
crimson
neon
cyber
aurora
contrast
```

Human-readable names:

```text
Civic Light
Midnight
Crimson Alert
Neon Pulse
Cyber Civic
Aurora
High Contrast
```

Theme switching must affect the entire application, not only one page.

---

# 40. THEME IMPLEMENTATION

Use a centralized theme context.

Concept:

```ts
type ThemeName =
  | "civic"
  | "midnight"
  | "crimson"
  | "neon"
  | "cyber"
  | "aurora"
  | "contrast";
```

Persist the selection using localStorage.

Example key:

```text
civicpulse-theme
```

Apply a class to:

```text
document.documentElement
```

Example:

```text
theme-civic
theme-midnight
theme-crimson
theme-neon
theme-cyber
theme-aurora
theme-contrast
```

---

# 41. CSS VARIABLE SYSTEM

Use centralized variables.

Examples:

```css
--cp-bg
--cp-surface
--cp-surface-2
--cp-card
--cp-card-hover
--cp-text
--cp-text-soft
--cp-text-muted
--cp-border
--cp-primary
--cp-primary-2
--cp-accent
--cp-danger
--cp-success
--cp-warning
--cp-shadow
```

Components should use theme variables instead of hardcoded colors whenever practical.

---

# 42. DARK THEME COMPATIBILITY

Dark themes must remain readable.

Do NOT blindly override:

```text
text-white
```

because white text is often intentionally used on colored buttons.

Instead carefully map neutral utilities such as:

```text
text-gray-900
text-gray-800
text-gray-700
text-gray-600
text-gray-500
```

and surfaces such as:

```text
bg-white
bg-gray-50
bg-gray-100
```

to theme variables where necessary.

---

# 43. ACCESSIBILITY

The application must support:

* Keyboard navigation
* Visible focus states
* Accessible labels
* Semantic HTML
* Adequate contrast
* Alternative text for images
* Screen-reader-friendly buttons
* Form error messages
* Reduced motion preference

Use:

```css
@media (prefers-reduced-motion: reduce)
```

to reduce animations when requested by the operating system.

---

# 44. ANIMATION SYSTEM

Animations should improve UX rather than distract.

Use subtle:

```text
Fade
Slide
Scale
Hover
Pulse
Skeleton
Page transition
```

Possible landing-page effects:

```text
Gradient background
Floating civic particles
Subtle grid
Animated statistics
Card hover
Button micro-interaction
```

Avoid excessive animation.

Never sacrifice performance for visual effects.

---

# 45. LOADING STATES

Every async operation must have a loading state.

Examples:

```text
Loading complaints...
Loading dashboard...
Getting your location...
Submitting report...
Uploading image...
Updating complaint...
```

Use skeletons/spinners where appropriate.

Do not leave users staring at a frozen interface.

---

# 46. ERROR STATES

Errors should be user-friendly.

Bad:

```text
TypeError: Cannot read properties of undefined
```

Better:

```text
We couldn't load your reports right now.
Please try again.
```

Log technical details for developers where appropriate, but don't expose unnecessary internal information to users.

---

# 47. EMPTY STATES

Examples:

```text
No reports yet.

You haven't submitted a civic issue.
Report your first issue to get started.
```

Admin:

```text
No complaints match the current filters.
```

Map:

```text
No civic issues found in this area.
```

---

# 48. TOAST / NOTIFICATION SYSTEM

Use consistent feedback for:

```text
Success
Warning
Error
Information
```

Examples:

```text
Report submitted successfully.
Complaint status updated.
Profile saved.
Location permission is required.
Unable to upload image.
```

---

# 49. PERFORMANCE

Optimize:

* Images
* Bundle size
* Map rendering
* Database queries
* Re-renders
* Large complaint lists
* API calls

Avoid:

```text
Unnecessary useEffect
Repeated database calls
Large unoptimized images
Duplicate state
Global unnecessary re-renders
```

Use memoization only where it provides actual benefit.

---

# 50. CODE QUALITY

Use:

* TypeScript
* Strong typing
* Reusable components
* Clear naming
* Small functions
* Separation of concerns
* Service layer
* Context only when appropriate
* Centralized constants

Avoid:

* `any` unless absolutely necessary
* Giant components
* Duplicate logic
* Hardcoded production data
* Dead code
* Unused imports
* Unused dependencies

---

# 51. COMPONENT ARCHITECTURE

Prefer:

```text
Page
 ↓
Feature Component
 ↓
Reusable UI Component
 ↓
Service / Context / Hook
 ↓
Supabase
```

Example:

```text
CitizenDashboard
      ↓
ComplaintCard
      ↓
ComplaintService
      ↓
Supabase
```

---

# 52. SERVICE ARCHITECTURE

Database access should be isolated where practical.

Example:

```text
src/services/
    complaintService.ts
```

Do not scatter raw Supabase queries throughout every UI component.

Prefer:

```ts
await complaintService.getUserComplaints();
```

instead of repeating:

```ts
supabase
  .from("complaints")
  .select(...)
```

in multiple pages.

---

# 53. HOOKS

Use reusable hooks for repeated logic.

Examples:

```text
useComplaints()
useAuth()
useTheme()
useGeolocation()
```

A hook should have a single clear responsibility.

---

# 54. DATABASE RULES

Use PostgreSQL through Supabase.

Design database relationships carefully.

Potential entities:

```text
profiles
complaints
complaint_images
response_teams
notifications
complaint_updates
```

Only create tables when they provide real product value.

---

# 55. ROW LEVEL SECURITY

RLS is mandatory for production data.

Citizens should generally:

```text
SELECT their own complaints
INSERT their own complaints
UPDATE only permitted fields of their own records
```

Administrators may have broader permissions based on role.

Never rely only on React route protection.

Database policies must enforce authorization.

---

# 56. COMPLAINT AUDIT HISTORY

For production-quality tracking, consider:

```text
complaint_updates
```

with:

```text
id
complaint_id
actor_id
old_status
new_status
old_priority
new_priority
comment
created_at
```

This allows a complaint timeline.

Example:

```text
10:21 AM
Submitted by Citizen

11:05 AM
Reviewed by Admin

12:15 PM
Assigned to Road Maintenance

03:40 PM
Marked Resolved
```

Do not fabricate history entries.

---

# 57. NOTIFICATION SYSTEM

Future/production notifications may include:

```text
Complaint received
Complaint reviewed
Team assigned
Status changed
Complaint resolved
```

Notifications should be tied to real events.

---

# 58. SEARCH AND FILTER PERFORMANCE

For small datasets:

Client-side filtering may be acceptable.

For large datasets:

Use database-level filtering.

Do not download thousands of records unnecessarily just to filter them in the browser.

---

# 59. IMAGE INTELLIGENCE PAGE

The `/ai` route exists as part of the product architecture.

However:

## IMPORTANT

The AI Assistant and conversational AI are NOT currently a development priority.

Do not spend time implementing Gemini chat until the core platform is complete.

For image intelligence:

If there is no real model connected:

DO NOT generate random fake predictions.

Use a clearly marked state such as:

```text
Image Intelligence
Coming Soon

Connect a trained civic-image model to analyze
uploaded infrastructure images.
```

When a real model is eventually integrated, the UI should clearly show:

```text
Model
Prediction
Confidence
Category
Severity
Explanation
```

Only if these values come from the actual model.

---

# 60. AI ASSISTANT — FINAL PHASE ONLY

Do not prioritize this section now.

When the core CivicPulse platform is stable, implement:

```text
React Assistant UI
       ↓
Backend API
       ↓
AI Model
       ↓
CivicPulse Tools
       ↓
Supabase
```

Potential tools:

```text
search_issues
get_issue
get_issue_statistics
get_nearby_issues
get_user_reports
get_issue_categories
```

The AI must never invent database facts.

But again:

# DO NOT IMPLEMENT THIS NOW.

This is the final development phase.

---

# 61. REAL-TIME DATA

Where useful, consider Supabase realtime for:

* Complaint status
* Admin updates
* Notifications
* Live dashboards

Only add realtime subscriptions where they provide meaningful value.

Clean up subscriptions properly.

---

# 62. ERROR HANDLING

Every backend/database call should handle:

```text
success
loading
empty
error
```

Example:

```ts
try {
  ...
} catch (error) {
  ...
}
```

Do not swallow errors silently.

---

# 63. FORM VALIDATION

Validate:

* Required fields
* String length
* Valid category
* Valid coordinates
* Image type
* Image size
* Email format
* Description length

Validation should happen before submission.

Backend/database constraints should also exist where appropriate.

---

# 64. RESPONSIVE ADMIN UI

Admin tables should remain usable on smaller screens.

Possible approach:

Desktop:

```text
Full data table
```

Mobile:

```text
Stacked complaint cards
```

Do not create horizontally unusable tables.

---

# 65. RESPONSIVE MAP

On mobile:

* Map controls must remain accessible.
* Filters should collapse appropriately.
* Nearby issue list should be scrollable.
* Current location button should remain reachable.
* Marker popups must not overflow the viewport.

---

# 66. LANDING PAGE

The landing page should immediately communicate:

```text
What is CivicPulse?
Why does it matter?
How does it work?
What can citizens do?
```

Suggested sections:

```text
Hero
↓
Problem
↓
Solution
↓
How It Works
↓
Core Features
↓
Civic Map Preview
↓
Statistics
↓
Community Impact
↓
Team
↓
CTA
↓
Footer
```

---

# 67. LANDING PAGE HERO

Primary message:

```text
Smarter Cities.
Stronger Communities.
```

Supporting message:

```text
Report civic problems, track their progress,
and help communities respond faster.
```

Primary CTA:

```text
Report an Issue
```

Secondary CTA:

```text
Explore Civic Map
```

---

# 68. HOW IT WORKS

Use:

```text
01
Report

02
Locate

03
Track

04
Resolve
```

Explain each step briefly.

---

# 69. FOOTER

Footer should contain:

```text
CivicPulse AI
Smarter Cities • Stronger Communities

Navigation
Resources
Team
GitHub
```

Include:

```text
Pie-3.1416
HACK • BUILD • INNOVATE
```

Do not claim government affiliation.

---

# 70. 404 PAGE

Create a polished 404 experience.

Example:

```text
404

Looks like this civic route doesn't exist.

Return Home
Explore Civic Map
```

Do not leave users at a blank page.

---

# 71. DATA INTEGRITY

Never silently mutate important user data.

For administrative changes:

```text
Confirm action
       ↓
Database update
       ↓
Success response
       ↓
UI refresh
```

For destructive actions:

```text
Confirmation
      ↓
Delete / archive
      ↓
Success
```

---

# 72. GIT SAFETY

This project already contains valuable development history.

NEVER use destructive commands without explicit instruction.

Avoid blindly running:

```bash
git reset --hard
git clean -fd
git push --force
```

Do not overwrite existing work merely to solve a merge conflict.

Before major Git operations:

```bash
git status
git branch
git log --oneline --decorate -10
```

Create a backup branch before risky operations.

Example:

```bash
git switch -c backup-before-change
```

---

# 73. CHANGE MANAGEMENT

Before modifying a major feature:

```text
1. Inspect
2. Understand
3. Plan
4. Modify
5. Typecheck
6. Build
7. Test
8. Review
```

Do not rewrite an entire page simply because one component needs modification.

---

# 74. DEPENDENCY MANAGEMENT

Before adding a package:

Ask:

```text
Do we already have a package that solves this?
```

Avoid dependency duplication.

Do not install large frameworks for simple tasks.

After dependency changes:

```bash
npm install
npm run typecheck
npm run build
```

---

# 75. BUILD VERIFICATION

After meaningful changes:

```bash
npm run build
```

The build must complete without errors.

Also verify:

```text
Routes
Images
Assets
Environment variables
Authentication
Map
Forms
Database
Responsive layouts
```

---

# 76. BROWSER TESTING

Test:

### Desktop

```text
Chrome
Firefox
Edge
```

### Mobile

```text
Responsive Chrome
```

Important screen sizes:

```text
375px
768px
1024px
1440px
```

---

# 77. TESTING CHECKLIST

## Landing

* [ ] Loads
* [ ] Navigation works
* [ ] CTA works
* [ ] Images load
* [ ] Responsive

## Authentication

* [ ] Signup works
* [ ] Login works
* [ ] Logout works
* [ ] Invalid credentials handled
* [ ] Protected routes work

## Citizen

* [ ] Dashboard loads
* [ ] Reports load
* [ ] New report works
* [ ] Image upload works
* [ ] Location works
* [ ] Profile works

## Map

* [ ] Map loads
* [ ] Markers load
* [ ] Current location works
* [ ] Filters work
* [ ] Nearby distances work
* [ ] Mobile map works

## Admin

* [ ] Admin route protected
* [ ] Complaints load
* [ ] Search works
* [ ] Filters work
* [ ] Status update works
* [ ] Priority update works
* [ ] Assignment works

## Themes

* [ ] Civic Light
* [ ] Midnight
* [ ] Crimson Alert
* [ ] Neon Pulse
* [ ] Cyber Civic
* [ ] Aurora
* [ ] High Contrast

---

# 78. PERFORMANCE CHECKLIST

Before production:

* [ ] No console errors
* [ ] No missing assets
* [ ] No broken routes
* [ ] No unnecessary API requests
* [ ] Images optimized
* [ ] Map performance acceptable
* [ ] Bundle reasonable
* [ ] Loading states implemented
* [ ] Error states implemented

---

# 79. SEO

Add appropriate:

```html
<title>CivicPulse AI — Smarter Cities, Stronger Communities</title>
<meta
  name="description"
  content="CivicPulse AI helps communities report, track and visualize civic issues."
/>
```

Also configure:

* Open Graph metadata
* Favicon
* Social preview image
* Canonical URL where appropriate

Do not claim official government status.

---

# 80. PWA / FUTURE MOBILE SUPPORT

Future possibility:

```text
React Web App
       ↓
PWA
       ↓
Installable Mobile Experience
```

Potential future capabilities:

* Offline report drafting
* Push notifications
* GPS capture
* Camera integration
* Mobile-first issue reporting

Do not add unnecessary PWA complexity until the core platform is stable.

---

# 81. FUTURE CIVIC ANALYTICS

Potential dashboard:

```text
                    CIVIC ANALYTICS

        Total Issues        Resolved
             │                  │
             ▼                  ▼
          1,248                73%

       ┌─────────────────────────────┐
       │ Issues by Category          │
       │                             │
       │ Pothole       █████████     │
       │ Garbage       ███████       │
       │ Waterlogging  █████         │
       │ Streetlight   ████          │
       └─────────────────────────────┘

       ┌─────────────────────────────┐
       │ Geographic Hotspots         │
       │          🗺️                 │
       └─────────────────────────────┘
```

All displayed numbers must be generated from actual data.

---

# 82. FUTURE ML FEATURES

When enough real data exists, possible ML applications include:

```text
Issue Classification
Priority Prediction
Duplicate Detection
Resolution Time Prediction
Hotspot Detection
Image Classification
Infrastructure Damage Detection
```

Do not build ML features merely for the sake of saying "AI".

Every model should solve a real civic problem.

---

# 83. PRODUCT PRINCIPLE

Every feature must answer:

> "What civic problem does this solve?"

If the answer is unclear, reconsider the feature.

---

# 84. UI PRINCIPLE

Do not create:

```text
Dashboard full of random cards
Random animations
Unnecessary gradients
Fake statistics
Fake AI
Fake maps
Decorative features with no purpose
```

Prefer:

```text
Clear information
Useful actions
Readable hierarchy
Meaningful visualization
Consistent components
Real data
```

---

# 85. DATA PRINCIPLE

The application should distinguish between:

```text
REAL DATA
DEMO DATA
COMING SOON
```

Never mix them without labeling.

---

# 86. DEVELOPMENT MODE

When mock data is necessary during development:

Use a clearly named source:

```text
mockComplaints.ts
```

and make it obvious that it is development data.

Production pages should use real Supabase data.

---

# 87. FINAL QUALITY BAR

Before considering CivicPulse complete, the application should feel like:

```text
University Project
       ↓
Professional Prototype
       ↓
Production-Ready Architecture
       ↓
Real Civic Technology Product
```

The goal is not merely to have many features.

The goal is:

# A coherent, usable and technically credible civic platform.

---

# 88. FINAL IMPLEMENTATION ORDER

Follow this exact priority.

## STEP 1

Audit existing code.

Do not modify anything yet.

Inspect:

```text
src/
public/
package.json
App.tsx
main.tsx
contexts/
components/
pages/
services/
types/
Supabase configuration
```

---

## STEP 2

Fix broken imports, routes and assets.

Especially verify:

```text
CivicPulse logo
Team logo
Member images
Map CSS
Page imports
```

---

## STEP 3

Stabilize authentication.

Verify:

```text
Signup
Login
Logout
Protected Routes
Admin Role
```

---

## STEP 4

Stabilize Supabase.

Verify:

```text
Database
Auth
RLS
Complaint CRUD
User ownership
Admin permissions
```

---

## STEP 5

Complete reporting.

Verify:

```text
Form
Validation
Location
Image
Database insert
Success
Error
```

---

## STEP 6

Complete citizen dashboard.

Verify:

```text
Statistics
Reports
Statuses
Recent complaints
Navigation
```

---

## STEP 7

Complete Civic Map.

Verify:

```text
Live location
Markers
Filters
Nearby issues
Distance
Responsive design
```

---

## STEP 8

Complete Admin Command Center.

Verify:

```text
Search
Filter
Status
Priority
Assignment
Statistics
```

---

## STEP 9

Complete Theme System.

Verify every page under:

```text
Civic Light
Midnight
Crimson Alert
Neon Pulse
Cyber Civic
Aurora
High Contrast
```

---

## STEP 10

Complete Team Page.

Verify:

```text
Logo
Team identity
Member cards
Links
Responsive layout
```

---

## STEP 11

Complete analytics.

Use actual database data.

---

## STEP 12

Complete image intelligence.

Only use a real model.

---

# 89. FINAL PHASE — AI ASSISTANT

ONLY after everything above is stable.

Implement:

```text
AI Assistant
Gemini/API
FastAPI
Tool Calling
Civic Data Queries
Conversation History
```

The assistant must use real CivicPulse data.

It must never fabricate:

```text
complaint count
complaint status
user reports
location data
statistics
administrative actions
```

If data is unavailable:

```text
"I don't have access to that information."
```

Never invent it.

---

# 90. AI ASSISTANT DEVELOPMENT RULE

Until Phase 12:

# DO NOT SPEND DEVELOPMENT TIME ON THE AI ASSISTANT.

Focus on the civic platform first.

---

# 91. DEFINITION OF DONE

CivicPulse Core Platform is considered complete only when:

* [ ] Authentication works
* [ ] Protected routes work
* [ ] Admin authorization works
* [ ] Supabase database works
* [ ] RLS works
* [ ] Complaint creation works
* [ ] Complaint retrieval works
* [ ] Complaint status works
* [ ] Complaint priority works
* [ ] Image upload works
* [ ] Geolocation works
* [ ] Civic Map works
* [ ] Nearby issues work
* [ ] Citizen dashboard works
* [ ] Admin dashboard works
* [ ] Profile works
* [ ] Team page works
* [ ] Themes work
* [ ] Responsive design works
* [ ] Loading states exist
* [ ] Error states exist
* [ ] Empty states exist
* [ ] No fake production data
* [ ] No broken images
* [ ] No console errors
* [ ] Production build succeeds
* [ ] Vercel deployment succeeds

Only then proceed to advanced AI features.

---

# 92. FINAL INSTRUCTION TO THE CODING AGENT

You are working on an existing production-oriented project.

Therefore:

1. DO NOT start over.
2. DO NOT delete existing functionality.
3. DO NOT replace working pages unnecessarily.
4. DO NOT create fake AI.
5. DO NOT create fake database statistics.
6. DO NOT hardcode user location.
7. DO NOT expose secrets.
8. DO NOT break existing routes.
9. DO NOT overwrite existing assets.
10. DO NOT force Git history changes.
11. DO NOT use destructive Git commands without explicit approval.
12. DO NOT add unnecessary dependencies.
13. DO NOT claim a feature is complete until it is actually functional.
14. ALWAYS inspect existing code before modifying it.
15. ALWAYS preserve existing working functionality.
16. ALWAYS test after significant changes.
17. ALWAYS prefer real data over mock data.
18. ALWAYS provide graceful loading/error/empty states.
19. ALWAYS maintain responsive behavior.
20. ALWAYS keep the application visually consistent.

Most importantly:

# BUILD THE CORE CIVIC PLATFORM FIRST.

The AI Assistant is the LAST major feature.

---

# 93. PROJECT IDENTITY

```text
╔══════════════════════════════════════════════╗
║                                              ║
║              CIVICPULSE AI                   ║
║                                              ║
║       Smarter Cities • Stronger Communities  ║
║                                              ║
║             PIE-3.1416                       ║
║                                              ║
║          HACK • BUILD • INNOVATE             ║
║                                              ║
╚══════════════════════════════════════════════╝
```

The final product should communicate:

```text
Report
   ↓
Locate
   ↓
Track
   ↓
Respond
   ↓
Resolve
   ↓
Learn
   ↓
Improve
```

# END OF MASTER PROMPT

````

### Recommended filename

```text
PROMPT.md
````

Put it at the root:

```text
CivicPulse-AI/
├── PROMPT.md
├── README.md
├── package.json
├── src/
├── public/
└── ...
```