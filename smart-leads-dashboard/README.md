# Smart Leads Dashboard

A MERN stack lead management dashboard.

## Tech Stack

- **Client:** React 19 + TypeScript + Vite + TailwindCSS v4
- **Server:** Node.js + Express + TypeScript + MongoDB (Mongoose)
- **Auth:** JWT + bcryptjs
- **Containerization:** Docker Compose

## Getting Started

### Prerequisites

- Node.js >= 18
- Docker (optional, for containerized setup)
- MongoDB (if running locally without Docker)

### Local Development

```bash
# Install dependencies
cd client && npm install
cd ../server && npm install

# Server (.env required)
cd server
cp .env.example .env
npm run dev

# Client (in a separate terminal)
cd client
cp .env.example .env
npm run dev
```

### Docker

```bash
docker compose up --build
```

- Client: http://localhost:5173
- Server API: http://localhost:5000/api
- MongoDB: mongodb://localhost:27017
