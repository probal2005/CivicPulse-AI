# CivicPulse AI

An AI-powered civic problem reporting and response platform built as a university hackathon project. Citizens can report problems like potholes, garbage overflow, waterlogging, broken streetlights, and damaged roads. The system displays reports in an admin command center and helps prioritize responses.

## Important Notice

- **AI predictions are simulated** for demonstration. No real ML model is connected. Confidence scores are hidden until a real model is available.
- **No real government partnerships** are claimed. This is a student demo project.
- **No authentication or real database** is implemented yet. Data is stored in memory during the session.
- **No external paid APIs** are used.

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Lucide React** for icons
- **Leaflet + OpenStreetMap** for the civic map

## Getting Started

```bash
# Install dependencies
npm install

# Start the development server
npm run dev

# Build for production
npm run build

# Preview the production build
npm run preview

# Run type checking
npm run typecheck
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/              # Base components (Button, Card, Badge, Modal, States)
│   ├── Navbar.tsx       # Top navigation bar
│   ├── Footer.tsx       # Footer with links
│   └── Layout.tsx       # Page layout wrapper
├── pages/               # Page-level components
│   ├── LandingPage.tsx       # Landing page with hero, features, team
│   ├── CitizenDashboard.tsx  # Citizen-facing summary dashboard
│   ├── ReportIssuePage.tsx   # Report submission form
│   ├── AdminCommandCenter.tsx# Admin dashboard with table and modal
│   ├── CivicMapPage.tsx      # Interactive Leaflet map
│   ├── AIIntelligencePage.tsx# Simulated AI image analysis
│   └── TeamPage.tsx          # Team member profiles
├── services/
│   └── complaintService.ts   # Service layer (swap with real API later)
├── hooks/
│   └── useComplaints.ts      # Custom hook for complaint state
├── data/
│   └── mockComplaints.ts     # Mock data and demo teams
└── types/
    └── complaint.ts          # TypeScript types and constants
```

## Pages

1. **Landing Page** — Hero, how-it-works, feature cards, CTA buttons, team section, footer.
2. **Citizen Dashboard** — Summary cards, recent complaints list, status badges.
3. **Report Issue** — Form with category, description, image upload, location, GPS coordinates, validation, loading/error states, success confirmation with report ID.
4. **Admin Command Center** — Stats cards, searchable/filterable complaint table, detail modal with assign team and update status controls.
5. **Civic Map** — Interactive Leaflet map with category-coded markers, popup details, and a list view fallback.
6. **AI Intelligence** — Image upload, simulated detection results, priority explanation, clear "no real model" notice. Ready for a FastAPI `/predict` endpoint.
7. **Team Page** — Five team member cards with roles, bios, skills, and social link placeholders.

## Service Layer

The `complaintService.ts` file currently uses in-memory mock data. To connect a real backend:

1. Replace the internal `complaintsStore` with API calls (e.g., `fetch` or Supabase client).
2. Keep the same method signatures (`getAll`, `getById`, `create`, `updateStatus`, `assignTeam`, etc.).
3. The UI components do not need to change.

## Connecting a Real AI Model

The AI Intelligence page is designed to work with a FastAPI `/predict` endpoint:

1. Build a FastAPI server that accepts an image and returns `{ category, confidence, priority, explanation }`.
2. Replace the `runAnalysis` function in `AIIntelligencePage.tsx` with a real API call.
3. Set `isSimulated: false` and populate `confidence` with the real value.

## Team

Update the placeholder names and social links in `src/pages/TeamPage.tsx` and `src/pages/LandingPage.tsx` with real team member information before presenting.
