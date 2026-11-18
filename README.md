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

```bash
cd server && npm install && npm run dev
```

```bash
cd client && npm install && npm run dev
```

## Author

Zeeshan Razzaq — course project
