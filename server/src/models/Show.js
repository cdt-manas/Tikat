const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
    movie: {
        type: mongoose.Schema.ObjectId,
        ref: 'Movie',
        required: true
    },
    theater: {
        type: mongoose.Schema.ObjectId,
        ref: 'Theater',
        required: true
    },
    screen: {
        name: { type: String, required: true },
        rows: { type: Number, required: true },
        cols: { type: Number, required: true }
    },
    format: {
        type: String,
        enum: ['2D', '3D', 'IMAX', '4DX'],
        default: '2D'
    },
    date: {
        type: Date,
        required: [true, 'Please add a date']
    },
    time: {
        type: String, // e.g., "18:00"
        required: [true, 'Please add a time']
    },
    ticketPrice: {
        type: Number,
        required: [true, 'Please add a ticket price']
    },
    bookedSeats: {
        type: [String], // Array of seat IDs like "A1", "B2"
        default: []
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Prevent adding the same show at the same time in the same screen
ShowSchema.index({ theater: 1, 'screen.name': 1, date: 1, time: 1 }, { unique: true });

module.exports = mongoose.model('Show', ShowSchema);
