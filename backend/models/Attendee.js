const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Attendee: name (required), email (required + unique), phone.
// "password" and "role" are extra fields needed for login and the role-based Organizer Panel.
const attendeeSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
  },
  phone: { type: String, trim: true },
  password: { type: String, required: [true, 'Password is required'], select: false },
  role: {
    type: String,
    enum: { values: ['attendee', 'organizer', 'admin'], message: 'Role must be attendee, organizer or admin' },
    default: 'attendee',
  },
});

// Hash the password automatically before saving
attendeeSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 10);
});

attendeeSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('Attendee', attendeeSchema);
