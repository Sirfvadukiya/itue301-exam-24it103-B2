// Run with: npm run seed   (clears Attendee/Event/Ticket and inserts demo data)
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Attendee = require('./models/Attendee');
const Event = require('./models/Event');
const Ticket = require('./models/Ticket');

const day = 24 * 60 * 60 * 1000;
const inDays = (n) => new Date(Date.now() + n * day);

(async () => {
  await connectDB();
  await Promise.all([Attendee.deleteMany(), Event.deleteMany(), Ticket.deleteMany()]);

  // use save() (via create) so the password gets hashed
  await Attendee.create([
    { name: 'Aarav Attendee', email: 'attendee@eventhub.com', phone: '9876543210', password: 'attendee123', role: 'attendee' },
    { name: 'Olivia Organizer', email: 'organizer@eventhub.com', phone: '9876500001', password: 'organizer123', role: 'organizer' },
    { name: 'Adam Admin', email: 'admin@eventhub.com', phone: '9876500002', password: 'admin123', role: 'admin' },
  ]);

  await Event.create([
    { title: 'Garba Night 2026', category: 'Cultural', date: inDays(10), venue: 'Anand Community Hall', ticketsAvailable: 120 },
    { title: 'Tech Talk: AI in Web Dev', category: 'Technology', date: inDays(14), venue: 'CSPIT Auditorium', ticketsAvailable: 60 },
    { title: 'Charusat Cricket Cup Final', category: 'Sports', date: inDays(21), venue: 'University Ground', ticketsAvailable: 200 },
    { title: 'Stand-up Comedy Evening', category: 'Entertainment', date: inDays(7), venue: 'Town Hall, Vadodara', ticketsAvailable: 5 },
    { title: 'Classical Music Concert', category: 'Music', date: inDays(30), venue: 'Sardar Patel Hall', ticketsAvailable: 80 },
    { title: 'Startup Pitch Day (SOLD OUT)', category: 'Business', date: inDays(5), venue: 'Innovation Hub', ticketsAvailable: 0 },
  ]);

  console.log('Seed complete. Logins:');
  console.log('  attendee  -> attendee@eventhub.com  / attendee123');
  console.log('  organizer -> organizer@eventhub.com / organizer123');
  console.log('  admin     -> admin@eventhub.com     / admin123');
  await mongoose.disconnect();
})().catch((e) => { console.error(e); process.exit(1); });
