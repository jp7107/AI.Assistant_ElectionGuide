# ElectraGuide 🗳️

**AI-powered Election Process Education Assistant for India**

ElectraGuide helps users — especially first-time voters — understand the Indian election process through an interactive AI chat assistant, visual timeline, polling booth finder, and knowledge quiz.

---

## Tech Stack

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React (Vite) + Tailwind CSS      |
| Backend    | Node.js + Express                 |
| AI         | Google Gemini API                 |
| Maps       | Google Maps API                   |
| Data       | Google Sheets API                 |
| Database   | MongoDB                           |
| Deployment | Docker + Google Cloud Run         |

---

## Features

- **🤖 AI Chat Assistant** — Personalised election guidance powered by Gemini AI
- **📅 Election Timeline** — 11-step visual timeline of the election process
- **📍 Polling Booth Finder** — Interactive map with booths across 8 major cities
- **🧠 Election Quiz** — 10 MCQs with scoring, explanations, and leaderboard

---

## Project Structure

```
promptwarchallege/
├── client/                  # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Hero.jsx
│   │   │   ├── ChatAssistant.jsx
│   │   │   ├── Timeline.jsx
│   │   │   ├── BoothFinder.jsx
│   │   │   └── Quiz.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── server/                  # Express backend
│   ├── routes/
│   │   ├── chat.js          # /api/chat → Gemini AI
│   │   ├── timeline.js      # /api/timeline → Google Sheets
│   │   ├── map.js           # /api/map → booth coordinates
│   │   └── quiz.js          # /api/quiz → MongoDB
│   ├── models/
│   │   ├── ChatHistory.js
│   │   └── QuizScore.js
│   ├── index.js
│   └── package.json
├── Dockerfile
├── README.md
└── package.json
```

---

## Setup & Run Locally

### 1. Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Google Gemini API key

### 2. Environment Variables

Create `server/.env`:
```env
GEMINI_API_KEY=your_gemini_api_key
MONGO_URI=mongodb://localhost:27017/electraguide
PORT=8080

# Optional
GOOGLE_SHEETS_API_KEY=your_sheets_api_key
GOOGLE_SHEET_ID=your_sheet_id
```

Create `client/.env`:
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_URL=/api
```

### 3. Install Dependencies
```bash
npm run install:all
```

### 4. Run Development Servers
```bash
# Terminal 1 — Backend (port 8080)
npm run dev:server

# Terminal 2 — Frontend (port 5173)
npm run dev:client
```

Open **http://localhost:5173**

---

## API Routes

| Method | Route                  | Description              |
|--------|------------------------|--------------------------|
| POST   | `/api/chat`            | Chat with Gemini AI      |
| GET    | `/api/chat/history/:id`| Get chat history         |
| GET    | `/api/timeline`        | Election timeline steps  |
| GET    | `/api/map`             | Polling booth locations  |
| GET    | `/api/map/cities`      | Available cities list    |
| GET    | `/api/quiz/questions`  | Get quiz questions       |
| POST   | `/api/quiz/submit`     | Submit quiz answers      |
| GET    | `/api/quiz/leaderboard`| Top scores               |

---

## Deploy to Google Cloud Run

### Build & Deploy
```bash
gcloud run deploy electra-guide \
  --source . \
  --platform managed \
  --region asia-south1 \
  --allow-unauthenticated \
  --set-env-vars="GEMINI_API_KEY=your_key,MONGO_URI=your_mongo_uri"
```

### Expected URL
```
https://electra-guide-<hash>-el.a.run.app
```

---

## Google Sheets Format (Optional)

If using Google Sheets for timeline data, create a sheet named `Timeline` with columns:

| Title | Description | Icon | Duration |
|-------|-------------|------|----------|
| Announcement | ECI announces... | 📢 | Day 0 |

---

Made with ❤️ for India's Democracy 🇮🇳
