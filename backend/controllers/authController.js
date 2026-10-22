const jwt = require('jsonwebtoken');
const Attendee = require('../models/Attendee');
const AppError = require('../middleware/AppError');

// POST /api/v1/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw new AppError('Email and password are required', 400);

    const attendee = await Attendee.findOne({ email: String(email).toLowerCase() }).select('+password');
    if (!attendee || !(await attendee.comparePassword(password))) {
      throw new AppError('Invalid email or password', 401);
    }

    const token = jwt.sign({ id: attendee._id, role: attendee.role }, process.env.JWT_SECRET, { expiresIn: '8h' });

    res.status(200).json({
      success: true,
      token,
      role: attendee.role,
      attendee: { _id: attendee._id, name: attendee.name, email: attendee.email, phone: attendee.phone, role: attendee.role },
    });
  } catch (err) {
    next(err);
  }
};
