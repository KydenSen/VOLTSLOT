# VOLTSLOT

An EV charging station booking and management platform built with React, TypeScript, and Firebase.

## Features

- **Interactive Map** — Browse nearby EV charging stations on a live Leaflet map with distance calculation
- **Slot Booking** — Reserve charging slots in real time with time-slot selection and availability tracking
- **Payment Flow** — In-app payment dialog for booking confirmation
- **User Dashboard** — View active bookings, charging history, and account profile
- **Admin Panel** — Manage stations, bookings, load balancing, and system settings
- **Dark / Light Theme** — Full theme support via `next-themes`
- **Firebase Backend** — Firestore for real-time data; Firebase Auth for user and admin authentication

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + Vite |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Map | Leaflet + react-leaflet |
| Backend | Firebase (Firestore + Auth) |
| Forms | react-hook-form + Zod |
| State | TanStack Query + React Context |
| Animation | Framer Motion |
| Testing | Vitest + Testing Library |

## Getting Started

### Prerequisites

- Node.js 18+
- A Firebase project with Firestore and Authentication enabled

### Installation

```bash
git clone https://github.com/KydenSen/VOLTSLOT.git
cd VOLTSLOT
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Seed Demo Data

```bash
npm run seed:firebase   # populate Firestore with demo stations/bookings
npm run clear:firebase  # remove demo data
```

### Tests

```bash
npm test
```

## Project Structure

```
src/
├── components/
│   ├── admin/          # Admin panel (BookingManagement, LoadManagement, AdminSettings)
│   ├── dashboard/      # User-facing views (StationMap, StationBottomSheet, PaymentDialog, ...)
│   ├── landing/        # Landing / marketing pages
│   └── ui/             # shadcn/ui primitives
├── contexts/           # BookingContext, ThemeContext
├── hooks/              # Custom React hooks
├── lib/                # Utility functions
├── pages/              # Route-level pages (Dashboard, Admin, Auth, ...)
└── types/              # Shared TypeScript types
```

## License

MIT
