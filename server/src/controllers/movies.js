const Movie = require('../models/Movie');

// @desc    Get all movies
// @route   GET /api/movies
// @access  Public
exports.getMovies = async (req, res, next) => {
    try {
        const movies = await Movie.find();
        res.status(200).json({ success: true, count: movies.length, data: movies });
    } catch (err) {
        next(err);
    }
};

// @desc    Get single movie
// @route   GET /api/movies/:id
// @access  Public
exports.getMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findById(req.params.id);

        if (!movie) {
            const error = new Error(`Movie not found with id of ${req.params.id}`);
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: movie });
    } catch (err) {
        next(err);
    }
};

// @desc    Create new movie
// @route   POST /api/movies
// @access  Private (Admin)
exports.createMovie = async (req, res, next) => {
    try {
        const movie = await Movie.create(req.body);
        res.status(201).json({ success: true, data: movie });
    } catch (err) {
        next(err);
    }
};

// @desc    Update movie
// @route   PUT /api/movies/:id
// @access  Private (Admin)
exports.updateMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!movie) {
            const error = new Error(`Movie not found with id of ${req.params.id}`);
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: movie });
    } catch (err) {
        next(err);
    }
};

// @desc    Delete movie
// @route   DELETE /api/movies/:id
// @access  Private (Admin)
exports.deleteMovie = async (req, res, next) => {
    try {
        const movie = await Movie.findByIdAndDelete(req.params.id);

        if (!movie) {
            const error = new Error(`Movie not found with id of ${req.params.id}`);
            error.statusCode = 404;
            throw error;
        }

        res.status(200).json({ success: true, data: {} });
    } catch (err) {
        next(err);
    }
};
