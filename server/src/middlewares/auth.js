const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Protect routes
// Protect routes
exports.protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next({
            message: 'Not authorized to access this route',
            statusCode: 401
        });
    }

    try {
        // 1. Verify Token with Supabase
        const { data: { user: supabaseUser }, error } = await require('../config/supabase').auth.getUser(token);

        if (error || !supabaseUser) {
            return next({
                message: 'Invalid token (Supabase)',
                statusCode: 401
            });
        }

        // 2. Sync with MongoDB (Lazy Load)
        // Check if user exists in our DB
        let user = await User.findOne({ email: supabaseUser.email });

        if (!user) {
            // Create user if not exists (First time login)
            user = await User.create({
                name: supabaseUser.user_metadata.full_name || 'User',
                email: supabaseUser.email,
                password: 'linked_with_supabase_' + Date.now(), // Dummy password
                isVerified: true // Supabase handles verification
            });
        }

        // 3. Attach User to Request
        req.user = user;
        next();

    } catch (err) {
        console.error('Auth Middleware Error:', err);
        return next({
            message: 'Not authorized',
            statusCode: 401
        });
    }
};

// Grant access to specific roles
exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            const error = new Error(`User role ${req.user.role} is not authorized to access this route`);
            error.statusCode = 403;
            return next(error);
        }
        next();
    };
};
