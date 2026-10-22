const router = require('express').Router();
const { getEvents, createEvent } = require('../controllers/eventController');
const { authGuard, requireRole } = require('../middleware/authGuard');

router.get('/', getEvents); // public listing
router.post('/', authGuard, requireRole('organizer', 'admin'), createEvent); // protected

module.exports = router;
