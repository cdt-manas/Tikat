const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const errorHandler = require('./middlewares/errorHandler');

const app = express();

// Middlewares
app.use(express.json()); // Body parser
app.use(cors()); // Enable CORS
app.use(helmet()); // Security headers
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev')); // Logging
}

// Route files
const auth = require('./routes/auth');
const movies = require('./routes/movies');
const theaters = require('./routes/theaters');
const shows = require('./routes/shows');
const bookings = require('./routes/bookings');

// Mount routers
app.use('/api/auth', auth);
app.use('/api/movies', movies);
app.use('/api/theaters', theaters);
app.use('/api/shows', shows);
app.use('/api/bookings', bookings);

// Basic Route
app.get('/', (req, res) => {
    res.send('Tikat API is running...');
});

// Error Handler Middleware (Should be last)
app.use(errorHandler);

module.exports = app;
