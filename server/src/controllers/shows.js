const Show = require('../models/Show');
const Theater = require('../models/Theater');

// @desc    Get all shows
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
    try {
        let query;
        const reqQuery = { ...req.query };

        // Filtering
        const filter = {};
        if (reqQuery.movie) filter.movie = reqQuery.movie;
        if (reqQuery.date) {
            // Simple date match (exact match or range logic can be added)
            // For now assuming exact ISO date match or partial date logic needed mostly on frontend
            // Let's support greater than or equal to date
            filter.date = { $gte: new Date(reqQuery.date) };
        }

        // If theater or city filtering needed, it's complex because we need to query Theater first or use aggregate.
        // For simplicity, we assume frontend provides theater ID if filtering by theater.

        query = Show.find(filter)
            .populate({
                path: 'movie',
                select: 'title posterUrl duration'
            })
            .populate({
                path: 'theater',
                select: 'name city address'
            });

        const shows = await query;

        res.status(200).json({ success: true, count: shows.length, data: shows });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single show
// @route   GET /api/shows/:id
// @access  Public
exports.getShow = async (req, res, next) => {
    try {
        const show = await Show.findById(req.params.id)
            .populate('movie')
            .populate('theater');

        if (!show) {
            const error = new Error(`Show not found with id of ${req.params.id}`);
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: show });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new show
// @route   POST /api/shows
// @access  Private (Admin)
exports.createShow = async (req, res, next) => {
    try {
        const { theater: theaterId, screenName } = req.body;

        // Fetch theater to validate screen and get layout
        const theater = await Theater.findById(theaterId);
        if (!theater) {
            const error = new Error(`Theater not found with id of ${theaterId}`);
            error.statusCode = 404;
            throw error;
        }

        // Find screen
        const screen = theater.screens.find(s => s.name === screenName);
        if (!screen) {
            const error = new Error(`Screen ${screenName} not found in theater`);
            error.statusCode = 404;
            throw error;
        }

        // Assign screen details to show
        req.body.screen = {
            name: screen.name,
            rows: screen.rows,
            cols: screen.cols
        };

        const show = await Show.create(req.body);
        res.status(201).json({ success: true, data: show });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete show
// @route   DELETE /api/shows/:id
// @access  Private (Admin)
exports.deleteShow = async (req, res, next) => {
    try {
        const show = await Show.findByIdAndDelete(req.params.id);

        if (!show) {
            const error = new Error(`Show not found with id of ${req.params.id}`);
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
