const express = require('express');
const {
    createBooking,
    getMyBookings,
    getBooking,
    createCheckoutSession,
    confirmBooking,
    getAllBookings,
    getAdminStats
} = require('../controllers/bookings');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

router.use(protect); // All booking routes are protected

// Admin Routes
router.get('/', authorize('admin'), getAllBookings);
router.get('/stats', authorize('admin'), getAdminStats);

router.post('/', createBooking);
router.post('/create-checkout-session', createCheckoutSession);
router.post('/confirm', confirmBooking);
router.get('/my-bookings', getMyBookings);
router.get('/:id', getBooking);

module.exports = router;
