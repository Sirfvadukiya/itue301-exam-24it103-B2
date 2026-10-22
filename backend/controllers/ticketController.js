const Ticket = require('../models/Ticket');
const Event = require('../models/Event');
const mongoose = require('mongoose');
const AppError = require('../middleware/AppError');

// POST /api/v1/tickets  (protected) - book tickets
exports.bookTicket = async (req, res, next) => {
  try {
    const { eventId, quantity } = req.body;
    const qty = Number(quantity);

    if (!eventId) throw new AppError('eventId is required', 400);
    if (!mongoose.isValidObjectId(eventId)) throw new AppError('Invalid eventId', 400);
    if (!Number.isInteger(qty) || qty < 1) throw new AppError('Quantity must be a whole number of at least 1', 400);

    // 1) find the event and check availability BEFORE touching anything
    const event = await Event.findById(eventId);
    if (!event) throw new AppError('Event not found', 404);
    if (event.ticketsAvailable < qty) {
      throw new AppError(`Only ${event.ticketsAvailable} ticket(s) available for "${event.title}"`, 400);
    }

    // 2) decrement stock. The filter (ticketsAvailable >= qty) makes this safe even if two
    //    people book at the same moment: the count can never go below zero.
    const updated = await Event.findOneAndUpdate(
      { _id: eventId, ticketsAvailable: { $gte: qty } },
      { $inc: { ticketsAvailable: -qty } },
      { new: true }
    );
    if (!updated) throw new AppError('Tickets just sold out. Please try a smaller quantity', 400);

    // 3) create the ticket (attendee comes from the token, never from the request body)
    let ticket;
    try {
      ticket = await Ticket.create({ attendeeId: req.user.id, eventId, quantity: qty });
    } catch (err) {
      // roll back the stock change if ticket creation failed
      await Event.findByIdAndUpdate(eventId, { $inc: { ticketsAvailable: qty } });
      throw err;
    }

    res.status(201).json({ success: true, data: ticket, ticketsRemaining: updated.ticketsAvailable });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/tickets/my  (protected) - only the logged-in attendee's tickets
exports.getMyTickets = async (req, res, next) => {
  try {
    const tickets = await Ticket.find({ attendeeId: req.user.id })
      .populate('attendeeId', 'name email')
      .populate('eventId', 'title date venue')
      .sort({ bookingDate: -1 });
    res.status(200).json({ success: true, count: tickets.length, data: tickets });
  } catch (err) {
    next(err);
  }
};

// PATCH /api/v1/tickets/:id/status  (protected)
exports.updateStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['booked', 'cancelled', 'used'].includes(status)) {
      throw new AppError('Status must be one of: booked, cancelled, used', 400);
    }

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) throw new AppError('Ticket not found', 404);

    const isOwner = String(ticket.attendeeId) === String(req.user.id);
    const isStaff = ['organizer', 'admin'].includes(req.user.role);
    if (!isOwner && !isStaff) throw new AppError('You can only update your own tickets', 403);

    // Attendees may only cancel; organizer/admin may also mark tickets as used
    if (!isStaff && status !== 'cancelled') throw new AppError('Attendees can only cancel tickets', 403);

    if (ticket.status !== 'booked') {
      throw new AppError(`Ticket is already ${ticket.status} and cannot be changed`, 400);
    }

    ticket.status = status;
    await ticket.save();

    // cancelling gives the seats back to the event
    if (status === 'cancelled') {
      await Event.findByIdAndUpdate(ticket.eventId, { $inc: { ticketsAvailable: ticket.quantity } });
    }

    res.status(200).json({ success: true, data: ticket });
  } catch (err) {
    next(err);
  }
};
