# GreenBasket

Multi-vendor local grocery marketplace — MERN stack.

## Structure

The repo is split into two top-level folders, one per process — each with its own dependencies, config, and lifecycle:

- `server/` — Express API
- `client/` — React (Vite) frontend

## Run locally

Terminal 1 — API (port 5000):
cd server && npm install && npm run dev

Terminal 2 — Client (port 5173):
cd client && npm install && npm run dev

Open http://localhost:5173 — Home page should show API status ok.

### API

Health check: http://localhost:5000/health
cp client/.env.example client/.env

Requirements:

- MongoDB running (or Atlas reachable)
- `server/.env` with a valid `MONGODB_URI` (copy it from `server/.env.example`)
- The server will not start if the database connection fails

Health check: GET http://localhost:5000/health
Response includes `db: connected` when MongoDB is reachable.

```bash
cd server && npm install && npm run dev
```

```bash
cd client && npm install && npm run dev
```

## Environment setup

### Server

cp server/.env.example server/.env

# Edit server/.env — set MONGODB_URI to your local or Atlas connection string

### Client

cp client/.env.example client/.env

# Default VITE_API_URL=http://localhost:5000

## Author

Zeeshan Razzaq — course project
