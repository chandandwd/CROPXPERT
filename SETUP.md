# CropXpert AI — Setup Guide (Node v24 Compatible)

## Requirements
- Node.js v18+ (v24 works perfectly)
- npm v9+

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:3000
```

## Demo Login
- Email: any email (e.g. farmer@example.com)
- Password: any password (e.g. demo123)

## Build for Production
```bash
npm run build
npm start
```

## Project Structure
```
cropxpert-app/
├── app/                    # Next.js App Router pages & API routes
│   ├── api/                # Backend API endpoints (mock data)
│   ├── dashboard/          # Main dashboard
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # shadcn/ui components
│   ├── sensor-dashboard.tsx
│   ├── disease-detection.tsx
│   ├── weather-widget.tsx
│   ├── market-prices.tsx
│   └── profit-predictor.tsx
├── hooks/
│   └── use-sensor-stream.ts
├── lib/
│   └── utils.ts
└── .env.local              # Add real API keys here (optional)
```

## Tech Stack
- Next.js 15, React 19, TypeScript
- Tailwind CSS v4, shadcn/ui
- Recharts for data visualization
- All APIs use mock data by default
