const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role } = req.body;

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            // If user exists and is verified, return error
            if (user.isVerified) {
                const error = new Error('Duplicate field value entered. This email is already registered.');
                error.statusCode = 400;
                throw error;
            }
            // If user exists but NOT verified, just update the OTP and name/password if changed
            user.name = name;
            user.password = password; // Will be re-hashed by pre-save hook
            // user.role = role; // Optional: update role
        } else {
            // Create new user (not verified yet)
            user = await User.create({
                name,
                email,
                password,
                role,
                isVerified: false
            });
        }

        // Generate OTP
        const otp = user.generateOTP();
        await user.save({ validateBeforeSave: false });

        // Send OTP via email
        const message = `Welcome to Tikat! Your OTP for email verification is: ${otp}\n\nThis OTP will expire in 10 minutes.`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Tikat - Email Verification OTP',
                message
            });

            res.status(201).json({
                success: true,
                message: 'Registration successful. Please verify your email with the OTP sent.',
                email: user.email
            });
        } catch (err) {
            console.error('Email error:', err);
            // Even if email fails, allow user to request new OTP
            res.status(201).json({
                success: true,
                message: 'Registration successful. OTP sent (check server console in development).',
                email: user.email
            });
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            const error = new Error('Please provide an email and password');
            error.statusCode = 400;
            throw error;
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        // Check if user is verified
        if (!user.isVerified) {
            const error = new Error('Please verify your email first. Check your inbox for OTP.');
            error.statusCode = 401;
            throw error;
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            const error = new Error('Invalid credentials');
            error.statusCode = 401;
            throw error;
        }

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Verify OTP
// @route   POST /api/auth/verify-otp
// @access  Public
exports.verifyOTP = async (req, res, next) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            const error = new Error('Please provide email and OTP');
            error.statusCode = 400;
            throw error;
        }

        const user = await User.findOne({
            email,
            otp,
            otpExpire: { $gt: Date.now() }
        });

        if (!user) {
            const error = new Error('Invalid or expired OTP');
            error.statusCode = 400;
            throw error;
        }

        // Mark user as verified
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpire = undefined;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// @desc    Resend OTP
// @route   POST /api/auth/resend-otp
// @access  Public
exports.resendOTP = async (req, res, next) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            const error = new Error('User not found');
            error.statusCode = 404;
            throw error;
        }

        if (user.isVerified) {
            const error = new Error('User is already verified');
            error.statusCode = 400;
            throw error;
        }

        // Generate new OTP
        const otp = user.generateOTP();
        await user.save({ validateBeforeSave: false });

        // Send OTP via email
        const message = `Your new OTP for email verification is: ${otp}\n\nThis OTP will expire in 10 minutes.`;

        await sendEmail({
            email: user.email,
            subject: 'Tikat - New Verification OTP',
            message
        });

        res.status(200).json({
            success: true,
            message: 'New OTP sent successfully'
        });
    } catch (err) {
        next(err);
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            const error = new Error('There is no user with that email');
            error.statusCode = 404;
            throw error;
        }

        // Get reset token
        const resetToken = user.getResetPasswordToken();

        await user.save({ validateBeforeSave: false });

        // Create reset url
        const resetUrl = `${req.protocol}://${req.get('host')}/resetpassword/${resetToken}`;
        const frontendResetUrl = `http://localhost:5173/reset-password/${resetToken}`; // Hardcoded frontend URL for now

        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl} \n\n OR go to content link: ${frontendResetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password reset token',
                message
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;

            await user.save({ validateBeforeSave: false });

            const error = new Error('Email could not be sent');
            error.statusCode = 500;
            throw error;
        }
    } catch (err) {
        next(err);
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
    try {
        // Get hashed token
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            const error = new Error('Invalid token');
            error.statusCode = 400;
            throw error;
        }

        // Set new password
        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (err) {
        next(err);
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = user.getSignedJwtToken();

    res
        .status(statusCode)
        .json({
            success: true,
            token
        });
};
