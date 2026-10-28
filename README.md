# Woods Decor Management Portal (Monorepo)

Central Management Portal and API for **KS Woods Decor Pvt. Ltd.** (luxury bespoke furniture showroom & manufacturing across Mohali, Kharar, and Australia).

## Monorepo Architecture

Powered by **Turborepo** + **pnpm workspaces**:

```
woods-decor-portal/
├── apps/
│   ├── backend/         # Node.js + Express + TypeScript REST API
│   │   ├── src/
│   │   │   ├── config/      # Environment variables & constants
│   │   │   ├── routes/      # API Route definitions (/api/v1/health, etc.)
│   │   │   ├── app.ts       # Express app setup (CORS, JSON parser, error handler)
│   │   │   └── server.ts    # Server boot & graceful shutdown
│   │   └── package.json
│   │
│   └── portal/          # (Upcoming) Next.js 15 App Router Frontend
│
├── packages/
│   └── types/           # Shared TypeScript interfaces & Zod validation schemas
│       ├── src/
│       │   ├── branch.ts    # Branch definitions & geo coordinates
│       │   ├── user.ts      # User, Roles, Shifts & Zod schemas
│       │   └── attendance.ts# Attendance payloads & status
│       └── package.json
│
├── pnpm-workspace.yaml
├── turbo.json
└── tsconfig.base.json
```

## Quick Start

### 1. Prerequisites
- Node.js >= 20
- pnpm >= 10

### 2. Install Dependencies
```bash
pnpm install
```

### 3. Build Packages
```bash
pnpm --filter @woods-decor/types build
```

### 4. Run the Backend API
```bash
pnpm --filter @woods-decor/backend dev
```
API runs on `http://localhost:5000`  
Health check: `http://localhost:5000/api/v1/health`
