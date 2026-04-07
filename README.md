# NeuroVerse 2.0

NeuroVerse is a full‑stack mental wellness web app with a modern React (Vite) frontend and a Node.js/Express backend backed by MongoDB Atlas.

It supports:
- Firebase Authentication on the client
- Server-side verification of Firebase ID tokens using Firebase Admin SDK
- Mood tracking, goals, journaling, feedback, specialists listing, chatbot, and a user dashboard

## Live Deployment

- **Frontend (Netlify):** `https://neuroversemind.netlify.app`
- **Backend (Render):** `https://neuroverse2-0-1.onrender.com`

> The frontend calls the backend via a Netlify redirect for `/api/*`.

---

## Repository Structure

```text
NeuroVerse 2.0/
  backend/                 # Express API server
  frontend/                # React (Vite) web app
  netlify.toml             # Netlify build config (root)
  .gitignore
```

---

## Tech Stack

### Frontend
- React 18
- Vite
- Tailwind CSS
- Axios
- Firebase Web SDK (Auth)
- React Router

### Backend
- Node.js + Express
- MongoDB Atlas + Mongoose
- Firebase Admin SDK (verify Firebase ID tokens)
- CORS

---

## Authentication Model (Firebase-first)

### How it works
- The **frontend** signs users in with Firebase.
- The **frontend** sends a Firebase **ID token** on requests:
  - `Authorization: Bearer <FIREBASE_ID_TOKEN>`
- The **backend** verifies this token using Firebase Admin (`verifyIdToken`) and then:
  - creates a Mongo user on first login (upsert-like behavior)
  - attaches `req.user` for protected routes

### Important
- The backend `POST /api/auth/login` and `POST /api/auth/signup` endpoints are **deprecated**.
- Use Firebase login/signup on the client and then call `GET /api/auth/me`.

---

## Local Development

### Prerequisites
- Node.js 18+
- MongoDB Atlas connection string (recommended)
- A Firebase project (for client auth)

### 1) Clone and install

```bash
git clone https://github.com/23scse1040541/NeuroVerse2.0.git
cd "NeuroVerse 2.0"
```

Install backend deps:
```bash
cd backend
npm install
```

Install frontend deps:
```bash
cd ../frontend
npm install
```

---

## Backend Setup (Local)

### 1) Create `backend/.env`
Copy example:
```bash
# from backend/
cp .env.example .env
```

### 2) Configure MongoDB
Set:
- `MONGODB_URI`

Example:
```env
MONGODB_URI=mongodb+srv://<user>:<pass>@<cluster>/<db>?retryWrites=true&w=majority
```

### 3) Configure Firebase Admin (server-side)
Choose **one** option:

#### Option A (Local dev, file path)
1. Download a Firebase service account JSON from Google Cloud / Firebase.
2. Place it at:
   - `backend/firebase-service-account.json`
3. Set:

```env
FIREBASE_SERVICE_ACCOUNT_PATH=./firebase-service-account.json
```

#### Option B (Recommended for Render, raw JSON)
Set:
```env
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account",...}
```

> Never commit the service account JSON. The repo is configured to ignore it.

### 4) Start the backend

```bash
cd backend
npm run dev
```

Backend runs at:
- `http://localhost:5000`

Health check:
- `GET http://localhost:5000/api/health`

---

## Frontend Setup (Local)

### 1) Configure Firebase Web config
Create `frontend/.env` (or use Netlify env vars when deploying):

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
VITE_FIREBASE_MEASUREMENT_ID=...   # optional
```

### 2) Start the frontend

```bash
cd frontend
npm run dev
```

Frontend runs at:
- `http://localhost:3000`

### Local API proxy
During local dev, Vite proxies `/api` to `http://localhost:5000`.

---

## Deploy (Render + Netlify)

### Backend on Render

Create a **Web Service** from the `backend/` folder.

- **Root Directory:** `backend`
- **Build Command:** `npm install`
- **Start Command:** `npm start`

Set environment variables:

```env
NODE_ENV=production
MONGODB_URI=...
CORS_ORIGIN=https://neuroversemind.netlify.app
FIREBASE_SERVICE_ACCOUNT_JSON={...}
```

> Render usually sets `PORT` automatically.

### Frontend on Netlify

This repo contains `netlify.toml` at the root to build the `frontend/` folder.

- **Base directory:** `frontend`
- **Build command:** `npm run build`
- **Publish directory:** `frontend/dist`

#### API redirect (important)
Netlify must forward `/api/*` to your Render backend.

In `frontend/netlify.toml`:

```toml
[[redirects]]
from = "/api/*"
to = "https://neuroverse2-0-1.onrender.com/api/:splat"
status = 200
force = true
```

Also ensure `frontend/public/_redirects` has:

```text
/api/*  https://neuroverse2-0-1.onrender.com/api/:splat  200
/*      /index.html                                 200
```

---

## API Overview

Most routes are protected and require:

```http
Authorization: Bearer <FirebaseIdToken>
```

### Auth
- `GET /api/auth/me`
- `PUT /api/auth/update-profile`
- `POST /api/auth/sync`
- `POST /api/auth/reward`

### Mood
- `GET /api/mood`
- `POST /api/mood`
- `GET /api/mood/analytics`
- `DELETE /api/mood/:id`

### Goals
- `GET /api/goals`
- `POST /api/goals`
- `PUT /api/goals/:id`
- `PUT /api/goals/:id/progress`
- `DELETE /api/goals/:id`

### Journal
- `GET /api/journal`
- `POST /api/journal`
- `GET /api/journal/:id`
- `PUT /api/journal/:id`
- `DELETE /api/journal/:id`

### Dashboard
- `GET /api/users/dashboard`

### Specialists
- `GET /api/specialists`
- `GET /api/specialists/:id`

### Feedback
- `POST /api/feedback`
- `GET /api/feedback`
- `GET /api/feedback/all` (admin)

### Chatbot
- `POST /api/chatbot`

---

## Troubleshooting

### Dashboard / mood / goals return 401
- Ensure you are logged in via Firebase.
- Ensure the browser is sending `Authorization: Bearer ...`.
- Ensure the frontend has Firebase env vars configured.

### Backend slow start
- MongoDB Atlas SRV DNS + TLS can take time on some networks.
- Test with `GET /api/health`.

### Netlify deploy works but API fails
- Confirm the `/api/*` redirect points to the correct Render URL.
- Confirm Render backend has `CORS_ORIGIN=https://neuroversemind.netlify.app`.

---

## Security Notes

- Do **NOT** commit:
  - `backend/firebase-service-account.json`
  - `backend/.env`
- If a service account key is ever exposed, **revoke/rotate it immediately** in Google Cloud.

---

## License

MIT
