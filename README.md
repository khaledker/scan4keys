# SCAN 4 KEYS v6.7

> A cyberpunk-themed video game deal finder — search titles, scan official retailers, and land the best price.

---

## Features

- **Game Search** — query the Nexarda API for any video game title
- **Price Scan** — animated "hacking-style" scan across multiple official retailers
- **Price Comparison** — side-by-side store prices with savings highlighted
- **Best Deal Detection** — automatically picks the lowest price with a savings banner
- **Store Redirect** — proceeds to the official store page with discount codes
- **Price Alerts** — UI for setting email alerts (frontend only)
- **Cyberpunk UI** — Matrix rain canvas animation, CRT scanlines, vignette, flicker effect
- **Ambient Audio** — low-frequency drone with synthesized SFX (typing, clicks, deal alerts)

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Tailwind CSS 3 + Lucide React |
| Backend | Node.js + Express 5 |
| API Proxy | CORS-enabled Express routes |
| API | Nexarda v3 (game pricing) |
| Bundler | Create React App (react-scripts 5) |
| Orchestration | concurrently |

## Architecture

```
scan4keys/
├── frontend/                     # React SPA
│   ├── public/                   # Static assets (favicon, manifest, index.html)
│   └── src/
│       ├── components/           # 14 reusable UI components
│       ├── hooks/                # Custom hooks (audio, scan, search, sfx)
│       └── utils/                # API client, constants, sound synthesis
├── backend/                      # Express proxy server
│   ├── routes/                   # Route handlers (search, prices, retailers)
│   └── server.js                 # Express entry point
├── package.json                  # Root orchestration with concurrently
└── .env.example                  # Environment variable reference
```

The backend acts as a proxy to the Nexarda API, keeping the API key server-side and avoiding CORS issues. The frontend communicates only with the backend.

## Prerequisites

- Node.js 18+
- npm 9+
- A Nexarda API key (set in `backend/.env`)

## Setup

```bash
# 1. Clone the repo
git clone https://github.com/your-username/scan4keys.git
cd scan4keys

# 2. Install all dependencies (root + frontend + backend)
npm run install:all

# 3. Configure environment variables
cp backend/.env.example backend/.env
# Edit backend/.env and set your NEXARDA_API_KEY

# 4. Start both servers
npm run dev
```

- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:4000

## Environment Variables

| Variable | File | Required | Default | Description |
|---|---|---|---|---|
| `NEXARDA_API_KEY` | `backend/.env` | Yes | — | API key for Nexarda v3 |
| `PORT` | `backend/.env` | No | `4000` | Backend server port |
| `REACT_APP_BACKEND_URL` | `frontend/.env` | No | `http://localhost:4000` | Backend URL for API calls |

## Available Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start frontend + backend concurrently |
| `npm run frontend` | Start frontend dev server only |
| `npm run backend` | Start backend proxy only |
| `npm run build` | Production build of frontend |
| `npm test` | Run frontend tests |
| `npm run install:all` | Install dependencies for all three `package.json` files |

## Project Structure

```
src/
├── components/
│   ├── ActivityLog.js        # Sidebar scan activity feed
│   ├── CrtEffects.js         # Scanlines, vignette, rolling wave overlays
│   ├── GameCard.js           # Individual game result thumbnail
│   ├── GameGrid.js           # Grid of game search results
│   ├── Header.js             # App title, sound toggle, info button
│   ├── MatrixRain.js         # Canvas-based Matrix digital rain
│   ├── NoDeal.js             # Empty state when no deals are found
│   ├── PriceAlertModal.js    # Email alert subscription modal
│   ├── PriceComparison.js    # Price table with store comparison
│   ├── ReadyState.js         # Initial idle state prompt
│   ├── RedirectModal.js      # Store redirect with discount info
│   ├── ScanProgress.js       # Animated scan progress overlay
│   ├── SearchBar.js          # Game title search input
│   └── SearchLoading.js      # Loading spinner overlay
├── hooks/
│   ├── useAmbientAudio.js    # Ambient drone audio context
│   ├── useScan.js            # Scan progress simulation
│   ├── useSearch.js          # Search & game selection logic
│   └── useSfx.js             # Sound effect wrapper
└── utils/
    ├── api.js                # API client (search, prices, retailers)
    ├── constants.js           # Store discounts, tutorial links
    └── sound.js              # Web Audio sound synthesis
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

This project is for educational purposes. All API usage is subject to the Nexarda API terms of service.
