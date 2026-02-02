const Booking = require('../models/Booking');
const Show = require('../models/Show');
const mongoose = require('mongoose');

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
    try {
        const { showId, seats } = req.body;

        // 1. Check if show exists
        const show = await Show.findById(showId);
        if (!show) {
            const error = new Error(`Show not found with id of ${showId}`);
            error.statusCode = 404;
            throw error;
        }

        // 2. Validate empty seats
        if (!seats || seats.length === 0) {
            const error = new Error('Please select at least one seat');
            error.statusCode = 400;
            throw error;
        }

        // 3. ATOMIC LOCK: Try to update the show document. 
        // We only update IF the requested seats are NOT already in 'bookedSeats'.
        const updateResult = await Show.updateOne(
            { _id: showId, bookedSeats: { $nin: seats } },
            { $push: { bookedSeats: { $each: seats } } }
        );

        if (updateResult.modifiedCount === 0) {
            const error = new Error('One or more selected seats are already booked');
            error.statusCode = 400;
            throw error;
        }

        // 4. Calculate total amount
        const totalAmount = show.ticketPrice * seats.length;

        // 5. Create Booking Record
        const booking = await Booking.create({
            user: req.user.id,
            show: showId,
            seats,
            totalAmount
        });

        res.status(201).json({ success: true, data: booking });

    } catch (err) {
        // If booking creation fails but seats were locked, we should ideally rollback the seats here
        // But for standalone dev mode without transactions, we'll accept this risk or manually rollback
        if (err.name !== 'Error') {
            // Attempt manual rollback (best effort)
            try {
                await Show.updateOne(
                    { _id: req.body.showId },
                    { $pull: { bookedSeats: { $in: req.body.seats } } }
                );
            } catch (rollbackErr) {
                console.error('Manual rollback failed', rollbackErr);
            }
        }
        next(err);
    }
};

// @desc    Get current user bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find({ user: req.user.id })
            .populate({
                path: 'show',
                populate: {
                    path: 'movie theater',
                    select: 'title posterUrl name city'
                }
            });

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate({
                path: 'show',
                populate: {
                    path: 'movie theater',
                    select: 'title posterUrl name city'
                }
            });

        if (!booking) {
            const error = new Error(`Booking not found with id of ${req.params.id}`);
            error.statusCode = 404;
            throw error;
        }

        if (booking.user.toString() !== req.user.id && req.user.role !== 'admin') {
            const error = new Error(`Not authorized to access this booking`);
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({ success: true, data: booking });
    } catch (err) {
        next(err);
    }
};

// @desc    Create Stripe Checkout Session
// @route   POST /api/bookings/create-checkout-session
// @access  Private
exports.createCheckoutSession = async (req, res, next) => {
    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const { showId, seats } = req.body;

        const show = await Show.findById(showId).populate('movie theater');
        if (!show) {
            const error = new Error('Show not found');
            error.statusCode = 404;
            throw error;
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'inr',
                        product_data: {
                            name: `${show.movie.title} - ${show.theater.name}`,
                            description: `Seats: ${seats.join(', ')} | ${show.time} | ${show.format || '2D'}`,
                            // images: [show.movie.posterUrl], // Removed to avoid Stripe errors with localhost/invalid URLs
                        },
                        unit_amount: show.ticketPrice * 100, // Amount in paise
                    },
                    quantity: seats.length,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.CLIENT_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&showId=${showId}&seats=${seats.join(',')}`,
            cancel_url: `${process.env.CLIENT_URL}/payment/failure`,
            metadata: {
                userId: req.user.id,
                showId: showId,
                seats: seats.join(','),
            },
        });

        res.status(200).json({ success: true, id: session.id, url: session.url });

    } catch (err) {
        next(err);
    }
};

// @desc    Confirm Booking after Stripe Payment
// @route   POST /api/bookings/confirm
// @access  Private
exports.confirmBooking = async (req, res, next) => {
    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const { session_id } = req.body;

        if (!session_id) {
            const error = new Error('Session ID is required');
            error.statusCode = 400;
            throw error;
        }

        // 1. Retrieve the session from Stripe
        const session = await stripe.checkout.sessions.retrieve(session_id);

        if (!session || session.payment_status !== 'paid') {
            const error = new Error('Payment not verified');
            error.statusCode = 400;
            throw error;
        }

        // 2. Extract metadata
        const { showId, seats, userId } = session.metadata;
        const seatsArray = seats.split(',');

        // 3. Atomically update Show seats
        const updateResult = await Show.updateOne(
            { _id: showId, bookedSeats: { $nin: seatsArray } },
            { $push: { bookedSeats: { $each: seatsArray } } }
        );

        if (updateResult.modifiedCount === 0) {
            const error = new Error('Seats already booked. Refund initiated (mock).');
            error.statusCode = 400;
            throw error;
        }

        // 4. Create Booking
        const booking = await Booking.create({
            user: userId,
            show: showId,
            seats: seatsArray,
            totalAmount: session.amount_total / 100
        });

        res.status(201).json({ success: true, data: booking });

    } catch (err) {
        next(err);
    }
};

// @desc    Get all bookings (Admin only)
// @route   GET /api/bookings
// @access  Private/Admin
exports.getAllBookings = async (req, res, next) => {
    try {
        const bookings = await Booking.find()
            .populate('user', 'name email')
            .populate({
                path: 'show',
                populate: {
                    path: 'movie theater',
                    select: 'title name city'
                }
            })
            .sort('-createdAt'); // Newest first

        res.status(200).json({ success: true, count: bookings.length, data: bookings });
    } catch (err) {
        next(err);
    }
};

// @desc    Get Admin Stats (Revenue, Counts)
// @route   GET /api/bookings/stats
// @access  Private/Admin
exports.getAdminStats = async (req, res, next) => {
    try {
        // 1. Total Revenue & Bookings using Aggregation
        const stats = await Booking.aggregate([
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalBookings: { $sum: 1 }
                }
            }
        ]);

        const revenue = stats.length > 0 ? stats[0].totalRevenue : 0;
        const bookingsCount = stats.length > 0 ? stats[0].totalBookings : 0;

        // 2. Count Movies query
        const Movie = require('../models/Movie');
        const Theater = require('../models/Theater');

        const moviesCount = await Movie.countDocuments();
        const theatersCount = await Theater.countDocuments();

        res.status(200).json({
            success: true,
            data: {
                revenue,
                bookings: bookingsCount,
                movies: moviesCount,
                theaters: theatersCount
            }
        });

    } catch (err) {
        next(err);
    }
};
