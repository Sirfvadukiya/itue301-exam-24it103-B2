# Viva Notes – read this before the exam

## How the app works (30-second version)
React (Vite) talks to Express through `/api/v1/...` (Vite proxy). Express talks to MongoDB through Mongoose.
Login returns a JWT; React stores it in AuthContext (+ localStorage) and sends it as `Authorization: Bearer <token>`.

## Backend – file by file
- `server.js` – creates the app, applies `cors`, `express.json`, **requestLogger (global)**, mounts the 3 route files, a 404 handler and finally the **errorHandler (must be last)**, then connects to MongoDB and listens.
- `config/db.js` – `mongoose.connect(process.env.MONGO_URI)`. The URI lives in `.env`, never in code.
- `models/*.js` – schemas with validation. Attendee: `name` required, `email` required+unique (+lowercase), password hashed with bcrypt in a `pre('save')` hook, `role` enum. Event: `ticketsAvailable` min 0. Ticket: `quantity` min 1, `status` enum booked|cancelled|used (default booked), `attendeeId`/`eventId` are `ObjectId` refs.
- `middleware/requestLogger.js` – prints `[METHOD] [PATH] [TIMESTAMP]` then `next()`.
- `middleware/authGuard.js` – reads the `Authorization` header, checks the "Bearer" scheme, `jwt.verify` with `JWT_SECRET`. Missing/invalid → 401. Success → `req.user = {id, role}`. Applied to all ticket routes and POST /events; NOT to login or GET /events.
- `middleware/errorHandler.js` – 4-argument middleware `(err, req, res, next)`. Turns Mongoose `ValidationError`, `CastError`, duplicate-key (11000) into friendly 400 JSON; anything else is a 500 with a generic message (no stack trace).
- `controllers/ticketController.js`
  - **bookTicket:** validate input → `Event.findById` → if `ticketsAvailable < quantity` throw 400 → `findOneAndUpdate({_id, ticketsAvailable: {$gte: qty}}, {$inc: {ticketsAvailable: -qty}})` (atomic, can never go negative) → `Ticket.create` (attendee id comes from the token) → 201. If create fails, stock is rolled back.
  - **getMyTickets:** `Ticket.find({attendeeId: req.user.id})` + `.populate('attendeeId','name email')` + `.populate('eventId','title date venue')`. *populate* replaces the stored ObjectId with the referenced document's selected fields.
  - **updateStatus:** only owner (or organizer/admin) may update; only a `booked` ticket can change; cancelling gives seats back with `$inc`.

## Frontend – file by file
- `context/AuthContext.jsx` – `createContext` + `useState` holding `{attendee, token, role}` with `login()`/`logout()`; persisted in localStorage.
- `components/ProtectedRoute.jsx` – no token → `<Navigate to="/">`; token but wrong role → `<Navigate to="/events">` (user stays logged in). Different targets so the two cases are distinguishable.
- `App.jsx` – routes + `React.lazy(() => import('./pages/OrganizerPanel.jsx'))` wrapped in `<Suspense>`: the Organizer code is downloaded only when `/organizer` is opened (visible as a separate chunk in `npm run build`).
- `components/EventCard.jsx` – props `title, category, date, venue, ticketsAvailable`; `ticketsAvailable === 0` → "Sold Out" badge, else "Book" button.
- `pages/EventsPage.jsx` – states `events`, `loading`, `error`; `useEffect(..., [])` fetches on mount; booking form uses `selectedEvent` + `quantity` state; search box keeps the full list in state and does `events.filter(...)` on render (no new request).
- `Navbar.jsx` – `<NavLink>` = client-side navigation without page reload.

## Likely viva questions
1. **Difference between 401 and 403?** 401 = not authenticated (no/invalid token). 403 = authenticated but not allowed (wrong role/not owner).
2. **Why is the error handler last?** Express runs middleware in order; errors passed with `next(err)` fall through to the 4-argument handler registered after all routes.
3. **Why hash passwords?** So a database leak does not reveal them; bcrypt adds a salt and is slow on purpose.
4. **What is a JWT?** Signed token (header.payload.signature) holding `id` and `role`; the server verifies the signature, so no session storage is needed.
5. **How do you stop overselling?** Check availability first, then an atomic conditional update (`ticketsAvailable >= qty`) with `$inc`; count can never go below 0.
6. **What does populate do?** Replaces ObjectId references with the actual documents (selected fields).
7. **Why `useEffect` with `[]`?** Runs once after the first render = "on mount", so the fetch happens once.
8. **Why derive the filtered list instead of storing it?** One source of truth; filtering is instant and needs no extra request.
9. **React.lazy / Suspense?** Code-splitting; component loads on demand and Suspense shows a fallback meanwhile.
10. **Why different redirects for no token vs wrong role?** Not logged in → go login; logged in but not allowed → go to a safe page, don't log out.
11. **Context vs props?** Context shares global state (auth) without passing props through every component.
12. **Why `.env`?** Keeps secrets out of Git; `.env.example` documents required variables.
13. **What is `unique: true` on email?** Creates a MongoDB unique index; duplicates cause error 11000, which the handler returns as a 400.
14. **What does `express.json()` do?** Parses JSON request bodies into `req.body`.
15. **What is the Vite proxy for?** Forwards `/api` to port 5000 so the browser sees one origin (no CORS problems).
