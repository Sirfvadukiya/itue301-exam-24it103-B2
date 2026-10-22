const mongoose = require('mongoose');

// Event: title, category, date, venue, ticketsAvailable
const eventSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Title is required'], trim: true },
  category: { type: String, trim: true },
  date: { type: Date, required: [true, 'Date is required'] },
  venue: { type: String, required: [true, 'Venue is required'], trim: true },
  ticketsAvailable: {
    type: Number,
    required: [true, 'ticketsAvailable is required'],
    min: [0, 'ticketsAvailable cannot be negative'],
  },
});

module.exports = mongoose.model('Event', eventSchema);
