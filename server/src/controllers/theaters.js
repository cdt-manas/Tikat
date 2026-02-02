const Theater = require('../models/Theater');

// @desc    Get all theaters
// @route   GET /api/theaters
// @access  Public
exports.getTheaters = async (req, res, next) => {
    try {
        // Filter by city if provided
        let query;
        const reqQuery = { ...req.query };

        if (reqQuery.city) {
            query = Theater.find({ city: reqQuery.city });
        } else {
            query = Theater.find();
        }

        const theaters = await query;
        res.status(200).json({ success: true, count: theaters.length, data: theaters });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single theater
// @route   GET /api/theaters/:id
// @access  Public
exports.getTheater = async (req, res, next) => {
    try {
        const theater = await Theater.findById(req.params.id);

        if (!theater) {
            const error = new Error(`Theater not found with id of ${req.params.id}`);
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: theater });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new theater
// @route   POST /api/theaters
// @access  Private (Admin)
exports.createTheater = async (req, res, next) => {
    try {
        const theater = await Theater.create(req.body);
        res.status(201).json({ success: true, data: theater });
    } catch (err) {
        next(err);
    }
};

// @desc    Update theater
// @route   PUT /api/theaters/:id
// @access  Private (Admin)
exports.updateTheater = async (req, res, next) => {
    try {
        const theater = await Theater.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!theater) {
            const error = new Error(`Theater not found with id of ${req.params.id}`);
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: theater });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete theater
// @route   DELETE /api/theaters/:id
// @access  Private (Admin)
exports.deleteTheater = async (req, res, next) => {
    try {
        const theater = await Theater.findByIdAndDelete(req.params.id);

        if (!theater) {
            const error = new Error(`Theater not found with id of ${req.params.id}`);
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
