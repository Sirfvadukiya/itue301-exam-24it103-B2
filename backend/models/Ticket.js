const mongoose = require('mongoose');

// Ticket: attendeeId (ref), eventId (ref), quantity, bookingDate, status
const ticketSchema = new mongoose.Schema({
  attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendee', required: [true, 'attendeeId is required'] },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: [true, 'eventId is required'] },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [1, 'Quantity must be at least 1'],
    validate: { validator: Number.isInteger, message: 'Quantity must be a whole number' },
  },
  bookingDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: { values: ['booked', 'cancelled', 'used'], message: 'Status must be booked, cancelled or used' },
    default: 'booked',
  },
});

module.exports = mongoose.model('Ticket', ticketSchema);
