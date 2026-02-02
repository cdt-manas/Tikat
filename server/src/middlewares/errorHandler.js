const errorHandler = (err, req, res, next) => {
    // Log to console for dev
    console.error(err.stack || err);

    let error = { ...err };
    error.message = err.message;

    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
        const message = `Resource not found`;
        error = new Error(message);
        res.status(404);
    }

    // Mongoose duplicate key
    if (err.code === 11000) {
        const message = 'Duplicate field value entered. This email is already registered.';
        error = new Error(message);
        res.status(400);
    }

    // Mongoose validation error
    if (err.name === 'ValidationError') {
        const message = Object.values(err.errors).map(val => val.message);
        error = new Error(message);
        res.status(400);
    }

    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;

    res.status(statusCode).json({
        success: false,
        message: error.message || err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
};

module.exports = errorHandler;
