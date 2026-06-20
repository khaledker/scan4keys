<div align="center">
  <br />
  <img src="frontend/public/logo192.png" alt="SCAN 4 KEYS" width="80" />
  <h1>⬡ SCAN 4 KEYS v6.7 ⬡</h1>
  <p>
    <strong>→ Hunt the best game deals. Like a hacker. ←</strong>
  </p>
  <p>
    <a href="https://scan4keys.com/">
      <code>🌐 scan4keys.com</code>
    </a>
  </p>
  <br />
  <p>
    <img src="https://img.shields.io/badge/React-19-58c4dc?logo=react&logoColor=white" alt="React 19" />
    <img src="https://img.shields.io/badge/Tailwind-3-38bdf8?logo=tailwindcss&logoColor=white" alt="Tailwind 3" />
    <img src="https://img.shields.io/badge/Express-5-000?logo=express&logoColor=white" alt="Express 5" />
    <img src="https://img.shields.io/badge/license-MIT-green" alt="MIT" />
    <img src="https://img.shields.io/badge/status-online-22c55e" alt="Status" />
  </p>
  <br />
</div>

---

```ascii
  ┌─────────────────────────────────────────────────────┐
  │   ░█▀▀░█▀▀░█▄░█░▄▀▀░▀█▀░█▀▀░░░█▄░█░█▀▀░█▀▀░█▀▀   │
  │   ░█▀▀░█▀▀░█░▄█░▀▄░░░█░░░▀▀█░░░█░▀█░█▀▀░█▀▀░▀▀█   │
  │   ░▀░░░▀▀▀░▀░░▀░░▀▀░░▀░░▀▀▀░░░▀░░▀░▀▀▀░▀▀▀░▀▀▀   │
  └─────────────────────────────────────────────────────┘
```

**SCAN 4 KEYS** is a cyberpunk-themed web app that searches for video game deals across official retailers, compares prices, and sends you straight to the best one — with a Matrix-style terminal aesthetic.

> 🚀 **Live at [`scan4keys.com`](https://scan4keys.com/)**

---

## ⚡ Features

| | |
|---|---|
| 🔍 **Game Search** | Query the Nexarda API for any title |
| 🌀 **Price Scan** | Animated "hacking" scan across retailers |
| 📊 **Price Comparison** | Side-by-side deals with savings |
| 🏆 **Best Deal** | Auto-detects lowest price + savings banner |
| 🛒 **Store Redirect** | Jump to the official store with discount codes |
| 🔔 **Price Alerts** | UI-ready email alert subscription |
| 🖥️ **Cyberpunk UI** | Matrix rain, CRT scanlines, vignette, flicker |
| 🔊 **Ambient Audio** | Drone hum + synthesized SFX (typing, clicks, alerts) |

---

## 🧱 Tech Stack

```
Frontend   →  React 19  │  Tailwind CSS 3  │  Lucide React
Backend    →  Node.js   │  Express 5
API        →  Nexarda v3 (game pricing)
Build      →  Create React App (react-scripts)
Runner     →  concurrently
```

---

## 🏗️ Architecture

```
scan4keys/
│
├── frontend/                     ← React SPA
│   ├── public/                   Static assets
│   └── src/
│       ├── components/           (14 UI components)
│       ├── hooks/                (4 custom hooks)
│       └── utils/                (API client, constants, sounds)
│
├── backend/                      ← Express proxy
│   ├── routes/                   (search, prices, retailers)
│   └── server.js
│
├── package.json                  ← Root orchestration
└── .env.example
```

The backend proxies all Nexarda API calls so the **API key stays server-side** — never exposed to the browser.

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 18
- npm ≥ 9
- A Nexarda API key

### Install & Run

```bash
# 1. Clone
git clone https://github.com/your-username/scan4keys.git
cd scan4keys

# 2. Install everything
npm run install:all

# 3. Set your API key
cp backend/.env.example backend/.env
# → edit backend/.env and add your NEXARDA_API_KEY

# 4. Launch both servers
npm run dev
```

```
 Frontend  →  http://localhost:3000
 Backend   →  http://localhost:4000
```

---

## 🔐 Environment Variables

| Variable | File | Required | Default | Description |
|---|---|---|---|---|
| `NEXARDA_API_KEY` | `backend/.env` | ✅ Yes | — | Nexarda API v3 key |
| `PORT` | `backend/.env` | ❌ No | `4000` | Backend port |
| `REACT_APP_BACKEND_URL` | `frontend/.env` | ❌ No | `http://localhost:4000` | Backend URL |

---

## 📁 Project Breakdown

```
frontend/src/
│
├── components/
│   ├── ActivityLog.js         Log feed
│   ├── CrtEffects.js          Scanlines + vignette overlays
│   ├── GameCard.js            Search result thumbnail
│   ├── GameGrid.js            Results grid
│   ├── Header.js              App bar + controls
│   ├── MatrixRain.js          Canvas Matrix rain
│   ├── NoDeal.js              Empty state
│   ├── PriceAlertModal.js     Alert subscription
│   ├── PriceComparison.js     Price table
│   ├── ReadyState.js          Idle prompt
│   ├── RedirectModal.js       Store redirect
│   ├── ScanProgress.js        Scan overlay
│   ├── SearchBar.js           Search input
│   └── SearchLoading.js       Loading spinner
│
├── hooks/
│   ├── useAmbientAudio.js     Ambient drone
│   ├── useScan.js             Scan simulation
│   ├── useSearch.js           Search logic
│   └── useSfx.js              Sound effects
│
└── utils/
    ├── api.js                 Backend API client
    ├── constants.js            Discounts, tutorial links
    └── sound.js               Web Audio synthesis
```

---

## 📜 Scripts

| Command | Does what? |
|---|---|
| `npm run dev` | Starts frontend + backend together |
| `npm run frontend` | Frontend dev server only |
| `npm run backend` | Backend proxy only |
| `npm run build` | Production build |
| `npm test` | Run frontend tests |
| `npm run install:all` | Install all dependencies |

---

## 🤝 Contributing

1. Fork it 🍴
2. Branch it (`git checkout -b feature/cool-stuff`)
3. Commit it (`git commit -m 'Add cool stuff'`)
4. Push it (`git push origin feature/cool-stuff`)
5. PR it 🎉

---

<div align="center">
  <br />
  <p>
    <a href="https://scan4keys.com/">
      <code>🌐 scan4keys.com</code>
    </a>
  </p>
  <p>
    <sub>Built with ⚡ by gamers, for gamers.</sub>
  </p>
  <br />
</div>
