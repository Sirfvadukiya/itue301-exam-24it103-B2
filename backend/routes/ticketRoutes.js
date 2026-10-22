const router = require('express').Router();
const { bookTicket, getMyTickets, updateStatus } = require('../controllers/ticketController');
const { authGuard } = require('../middleware/authGuard');

router.use(authGuard); // every ticket route is protected

router.post('/', bookTicket);
router.get('/my', getMyTickets);
router.patch('/:id/status', updateStatus);

module.exports = router;
