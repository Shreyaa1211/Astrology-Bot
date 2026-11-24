# 🔮 Astrology Bot — Vedic Astrology & Numerology Web App

An interactive astrology web app built with **React 19**, **Vite** and **Tailwind CSS**. It calculates sidereal (Vedic) planetary positions and numerology numbers from your birth details, and has a conversational **Oracle** chat that answers questions about your chart. Everything runs in the browser, so no birth data is sent to a server.

## ✨ Features

- 💬 **Oracle Chat** — conversational assistant with an intent classifier and context memory; understands birth details typed in plain text (dates, times, places)
- 🪐 **Natal Chart** — planetary placements computed client-side from your birth date, time and place
- 🔢 **Vedic Numerology** — Mulank (birth-day number), Bhagyank (destiny number) and name number, each with a full profile
- ♈ **Zodiac Horoscopes** — sidereal Rashi profiles with element and ruling planet
- 🃏 **Tarot Reading** — interactive card draw
- 🔒 **Private by design** — no backend and no external API calls

## 🧮 How the Calculations Work

The engine in `src/engine/astronomy.js` implements astronomy formulas directly in JavaScript:

- Converts dates to days since the **J2000.0** epoch
- Computes planetary longitudes using **Keplerian elements** with **Jean Meeus** perturbation corrections
- Applies the **Lahiri Ayanamsha** to convert tropical positions to sidereal (Vedic) Rashis

## 🛠️ Tech Stack

| Area | Tools |
|---|---|
| UI | React 19, Tailwind CSS, Lucide icons |
| Build | Vite |
| Logic | Plain JavaScript (astronomy, numerology and chat engines) |

## 📂 Project Structure

```
src/
├── engine/
│   ├── astronomy.js      # Planetary positions, J2000, Ayanamsha
│   ├── knowledge.js      # Numerology + Rashi knowledge base
│   └── oracle.js         # Chat intent classifier & response engine
├── components/           # Hero, NatalChart, OracleChat, TarotReading, ZodiacHoroscopes, ...
├── pages/ChatPage.jsx    # Full-screen Oracle consultation
└── App.jsx
```

## 🚀 Getting Started

```bash
git clone https://github.com/Shreyaa1211/Astrology-Bot.git
cd Astrology-Bot
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## 📜 Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Production build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Run ESLint |
