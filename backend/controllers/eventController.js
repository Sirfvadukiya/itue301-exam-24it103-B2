const Event = require('../models/Event');

// GET /api/v1/events  (public)
exports.getEvents = async (req, res, next) => {
  try {
    const events = await Event.find().sort({ date: 1 });
    res.status(200).json({ success: true, count: events.length, data: events });
  } catch (err) {
    next(err);
  }
};

// POST /api/v1/events  (organizer / admin only) - used by the Organizer Panel
exports.createEvent = async (req, res, next) => {
  try {
    const { title, category, date, venue, ticketsAvailable } = req.body;
    const event = await Event.create({ title, category, date, venue, ticketsAvailable });
    res.status(201).json({ success: true, data: event });
  } catch (err) {
    next(err);
  }
};
