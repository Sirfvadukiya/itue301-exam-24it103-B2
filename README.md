# EventHub – Ticket Booking System
**ITUE301 – Advanced Web Development Frameworks · Set F · CSPIT, CHARUSAT**

A MERN-style app (React + Express + MongoDB/Mongoose) where attendees browse and book event tickets,
organizers create events, and admins oversee the platform.

## Tech stack
- **Frontend:** React 18 (Vite), React Router v6, Context API for auth
- **Backend:** Node.js, Express.js, JWT (jsonwebtoken), bcryptjs
- **Database:** MongoDB with Mongoose

## Folder structure
```
itue301-exam-24it103-B2/
├── backend/
│   ├── config/db.js              # Mongoose connection (uses .env)
│   ├── models/                   # Attendee.js, Event.js, Ticket.js
│   ├── controllers/              # auth, event, ticket logic
│   ├── routes/                   # /api/v1/auth, /events, /tickets
│   ├── middleware/               # requestLogger, authGuard, errorHandler, AppError
│   ├── seed.js                   # demo data
│   ├── server.js
│   ├── .env.example
│   └── EventHub.postman_collection.json
├── frontend/
│   └── src/
│       ├── components/           # EventCard, Navbar, ProtectedRoute
│       ├── pages/                # LoginPage, EventsPage, MyTicketsPage, OrganizerPanel (lazy)
│       ├── context/AuthContext.jsx
│       ├── api.js, App.jsx, main.jsx, styles.css
├── README.md · VIVA_NOTES.md · SCREENSHOT_CHECKLIST.md
```

## 1. MongoDB setup
**Option A – Local MongoDB:** install MongoDB Community Server and make sure it is running on `mongodb://127.0.0.1:27017`.
**Option B – MongoDB Atlas:** create a free cluster → Database Access (create user) → Network Access (allow your IP / 0.0.0.0/0) →
Connect → Drivers → copy the connection string and use it as `MONGO_URI` (add `/eventhub` before the `?`).

## 2. Run the backend (port 5000)
```bash
cd backend
npm install          # also creates .env from .env.example if it does not exist
# edit backend/.env if you use Atlas (set MONGO_URI) – never commit .env
npm run seed         # inserts demo attendees + events
npm start            # or: node server.js
```
`.env` values: `PORT=5000`, `MONGO_URI=...`, `JWT_SECRET=...`

## 3. Run the frontend (port 5173)
```bash
cd frontend
npm install
npm run dev
```
Open **http://localhost:5173**. Vite proxies `/api` calls to `http://localhost:5000`, so start the backend first.

## Demo logins (created by `npm run seed`)
| Role | Email | Password |
|---|---|---|
| Attendee | attendee@eventhub.com | attendee123 |
| Organizer | organizer@eventhub.com | organizer123 |
| Admin | admin@eventhub.com | admin123 |

## REST API (`/api/v1`)
| Method | Endpoint | Access | Purpose |
|---|---|---|---|
| POST | /auth/login | public | Authenticate, returns JWT token |
| GET | /events | public | List all events |
| POST | /events | organizer/admin | Create an event (Organizer Panel) |
| POST | /tickets | token | Book tickets (validates + decrements `ticketsAvailable`) |
| GET | /tickets/my | token | Logged-in attendee's tickets (populated) |
| PATCH | /tickets/:id/status | token | Update status (cancel restores seats) |

Status codes: 200, 201, 400 (validation / not enough tickets), 401 (missing/invalid token), 403, 404, 500.
Import `backend/EventHub.postman_collection.json` into Postman / Thunder Client – run **Login** first (it saves the token automatically in Postman).

## Frontend routes
| Route | Page | Access |
|---|---|---|
| / | LoginPage | public |
| /events | EventsPage | protected (token) |
| /my-tickets | MyTicketsPage | protected (token) |
| /organizer | OrganizerPanel (React.lazy) | role `organizer` |

No token → redirect to `/`. Token but wrong role → redirect to `/events` (user stays logged in).

## Demonstrate a validation failure
Log in as the attendee and book more tickets than available (e.g. 10 for "Stand-up Comedy Evening", which has 5):
`POST /api/v1/tickets` → **400** `{"success":false,"status":400,"message":"Only 5 ticket(s) available for \"Stand-up Comedy Evening\""}`

## Push to GitHub
Repo name must be exactly `itue301-exam-24it103-B2`, **public**.
```bash
git init && git add . && git commit -m "EventHub exam submission"
git branch -M main
git remote add origin https://github.com/<username>/itue301-exam-24it103-B2.git
git push -u origin main
git rev-parse HEAD      # final commit SHA to submit
```
