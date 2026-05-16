# Smart Leads Dashboard

A full-stack lead management dashboard built with the MERN stack (MongoDB, Express, React, Node.js) using TypeScript end-to-end.

## Tech Stack

| Layer    | Technology                                      |
| -------- | ----------------------------------------------- |
| Frontend | React 19, TypeScript, Vite, TailwindCSS v4      |
| Backend  | Node.js, Express 5, TypeScript                  |
| Database | MongoDB 7, Mongoose 9                           |
| Auth     | JWT (jsonwebtoken), bcryptjs                    |
| Dev Ops  | Docker Compose                                  |

## Prerequisites

- **Node.js** >= 18
- **npm** >= 9
- **Docker** (optional — for containerized setup)
- **MongoDB** >= 7 (if running locally without Docker)

## Local Setup (without Docker)

### 1. Clone and install dependencies

```bash
cd smart-leads-dashboard

# Install server dependencies
cd server
npm install
cp .env.example .env

# Install client dependencies
cd ../client
npm install
cp .env.example .env
```

### 2. Configure environment

**server/.env**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-leads
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Start MongoDB

```bash
# Using Docker for just the database:
docker run -d -p 27017:27017 --name mongo-leads mongo:7

# Or use a local MongoDB instance on the default port
```

### 4. Start the server

```bash
cd server
npm run dev
```

Server starts at **http://localhost:5000**.

### 5. Start the client (separate terminal)

```bash
cd client
npm run dev
```

Client starts at **http://localhost:5173**.

## Local Setup (with Docker)

```bash
cd smart-leads-dashboard
docker compose up --build
```

Three services start:

| Service  | URL                                      |
| -------- | ---------------------------------------- |
| Client   | http://localhost:5173                    |
| Server   | http://localhost:5000/api                |
| MongoDB  | mongodb://localhost:27017                |

## Environment Variables

### Server (`server/.env`)

| Variable        | Default                                     | Description                      |
| --------------- | ------------------------------------------- | -------------------------------- |
| `PORT`          | `5000`                                      | API server port                  |
| `MONGO_URI`     | `mongodb://localhost:27017/smart-leads`     | MongoDB connection string        |
| `JWT_SECRET`    | _(required)_                                | Secret key for signing JWTs      |
| `JWT_EXPIRES_IN`| `7d`                                        | JWT expiration duration          |
| `CLIENT_URL`    | `http://localhost:5173`                     | Allowed CORS origin              |

### Client (`client/.env`)

| Variable       | Default                        | Description           |
| -------------- | ------------------------------ | --------------------- |
| `VITE_API_URL` | `http://localhost:5000/api`    | Backend API base URL  |

## API Documentation

All responses follow the format: `{ success: boolean, data?: any, message?: string, pagination?: PaginationMeta }`

### Authentication

| Method | Route                 | Auth | Role | Description                  |
| ------ | --------------------- | ---- | ---- | ---------------------------- |
| POST   | `/api/auth/register`  | No   | —    | Create a new user account    |
| POST   | `/api/auth/login`     | No   | —    | Sign in, returns JWT + user  |

**POST /api/auth/register**
```json
// Request
{ "name": "John", "email": "john@example.com", "password": "securepass" }

// Response 201
{ "success": true, "data": { "token": "jwt...", "user": { "id": "...", "name": "John", "email": "john@example.com", "role": "sales_user" } } }
```

**POST /api/auth/login**
```json
// Request
{ "email": "john@example.com", "password": "securepass" }

// Response 200
{ "success": true, "data": { "token": "jwt...", "user": { "id": "...", "name": "John", "email": "john@example.com", "role": "sales_user" } } }
```

### Leads

| Method | Route                 | Auth | Role       | Description                          |
| ------ | --------------------- | ---- | ---------- | ------------------------------------ |
| GET    | `/api/leads`          | Yes  | both       | List leads (paginated, filterable)   |
| POST   | `/api/leads`          | Yes  | both       | Create a new lead                    |
| PUT    | `/api/leads/:id`      | Yes  | both       | Update a lead (own or any if admin)  |
| DELETE | `/api/leads/:id`      | Yes  | admin only | Delete a lead                        |
| GET    | `/api/leads/export`   | Yes  | admin only | Download all leads as CSV            |

**GET /api/leads**

Query parameters:

| Param    | Type   | Default   | Description                              |
| -------- | ------ | --------- | ---------------------------------------- |
| `status` | string | —         | Filter by status (`New`, `Contacted`, `Qualified`, `Lost`) |
| `source` | string | —         | Filter by source (`Website`, `Instagram`, `Referral`)       |
| `search` | string | —         | Case-insensitive search on name or email |
| `sort`   | string | `latest`  | Sort order (`latest`, `oldest`)          |
| `page`   | number | `1`       | Page number                              |
| `limit`  | number | `10`      | Items per page (max 100)                 |

```json
// Response 200
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "status": "New",
      "source": "Website",
      "createdAt": "2026-05-16T...",
      "createdBy": "..."
    }
  ],
  "pagination": { "page": 1, "limit": 10, "total": 42, "pages": 5 }
}
```

**POST /api/leads**
```json
// Request
{ "name": "Jane Doe", "email": "jane@example.com", "source": "Website", "status": "New" }

// Response 201
{ "success": true, "data": { "_id": "...", "name": "Jane Doe", ... } }
```

**PUT /api/leads/:id**
```json
// Request (partial update)
{ "status": "Qualified" }

// Response 200
{ "success": true, "data": { "_id": "...", "name": "Jane Doe", "status": "Qualified", ... } }
```

**DELETE /api/leads/:id**
```json
// Response 200
{ "success": true, "message": "Lead deleted" }
```

**GET /api/leads/export**
Returns a CSV file with `Content-Type: text/csv` and headers: `Name, Email, Status, Source, Created At`.

### Health

| Method | Route          | Description                |
| ------ | -------------- | -------------------------- |
| GET    | `/api/health`  | Returns `{ status: "ok" }` |

## Folder Structure

```
smart-leads-dashboard/
├── client/                          # React frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/                  # Reusable primitives (Button, Input, Badge, Modal, Spinner)
│   │   │   ├── layout/              # Navbar, ProtectedRoute
│   │   │   └── leads/               # Lead-specific (LeadsTable, LeadRow, LeadFilters, etc.)
│   │   ├── pages/                   # LoginPage, RegisterPage, DashboardPage
│   │   ├── context/                 # AuthContext (useAuth hook)
│   │   ├── hooks/                   # useDebounce, useDarkMode
│   │   ├── services/                # Axios API client (api.ts)
│   │   ├── types/                   # TypeScript interfaces and enums
│   │   └── utils/                   # cn(), formatDate()
│   ├── .env.example
│   ├── Dockerfile
│   └── package.json
├── server/                          # Express backend
│   ├── src/
│   │   ├── controllers/             # Route handlers (auth, leads)
│   │   ├── routes/                  # Express routers
│   │   ├── services/                # Business logic layer
│   │   ├── middleware/              # auth.middleware, role.middleware
│   │   ├── models/                  # Mongoose schemas (User, Lead)
│   │   ├── validators/              # express-validator rules
│   │   ├── types/                   # TypeScript interfaces, enums, express.d.ts
│   │   └── utils/                   # JWT utilities
│   ├── .env.example
│   ├── Dockerfile
│   ├── nodemon.json
│   ├── tsconfig.json
│   └── package.json
├── docker-compose.yml               # mongo:7 + server + client
└── README.md
```

## Features

- [x] JWT-based authentication (register / login)
- [x] Role-based access control (admin / sales_user)
- [x] Full CRUD for leads with pagination
- [x] Advanced filtering (status, source, search, sort)
- [x] CSV export (admin only)
- [x] Dark mode (persisted, class-based, no flash)
- [x] Responsive design (mobile-friendly table scroll)
- [x] TypeScript end-to-end (strict mode, no `any`)
- [x] Docker Compose orchestration
- [x] Input validation (client + server)
- [x] Loading skeletons and error states
