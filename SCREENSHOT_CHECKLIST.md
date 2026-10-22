# Screenshots for 24IT103_SetF_Report.pdf

Start MongoDB, `npm run seed`, `npm start` (backend) and `npm run dev` (frontend) first.

1. **EventsPage with event cards** – log in as attendee@eventhub.com, open http://localhost:5173/events.
   Capture the full page showing the cards (including the "Sold Out" badge).
2. **Postman showing 201 on ticket creation**
   - Import `backend/EventHub.postman_collection.json`
   - Run **Auth → Login** (token is saved automatically), then **Events → Get all events** (saves an event id automatically)
   - Run **Tickets → Book tickets** → status **201 Created** must be visible in the screenshot
   - (Bonus) Run **Book too many** → capture the clean **400** JSON error as your validation-failure demo
3. **MongoDB showing a saved document** – MongoDB Compass (mongodb://127.0.0.1:27017) → database `eventhub` → collection `tickets`
   (or Atlas → Browse Collections) → capture a saved ticket document with attendeeId, eventId, quantity, status.

Put the 3 screenshots in one PDF named exactly `24IT103_SetF_Report.pdf`.
Note: the paper text mentions both "SetF" and "SetA" for the report name – SetF is your set; confirm with faculty if unsure.
