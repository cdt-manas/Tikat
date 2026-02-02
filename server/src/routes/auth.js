const express = require('express');
const { register, login, getMe, forgotPassword, resetPassword, verifyOTP, resendOTP } = require('../controllers/auth');
const { protect } = require('../middlewares/auth');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/verify-otp', verifyOTP);
router.post('/resend-otp', resendOTP);
router.post('/forgotpassword', forgotPassword);
router.put('/resetpassword/:resettoken', resetPassword);
router.get('/me', protect, getMe);

module.exports = router;
