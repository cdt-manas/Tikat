const mongoose = require('mongoose');

const ScreenSchema = new mongoose.Schema({
    name: {
        type: String, // e.g., "Screen 1"
        required: true
    },
    rows: {
        type: Number,
        required: true,
        default: 10
    },
    cols: {
        type: Number,
        required: true,
        default: 10
    }
});

const TheaterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a theater name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    city: {
        type: String,
        required: [true, 'Please add a city'],
        trim: true
    },
    address: {
        type: String,
        required: [true, 'Please add an address']
    },
    screens: [ScreenSchema],
    location: {
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        formattedAddress: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Geocode & create location field (Middleware placeholder - for now we seed manually)

module.exports = mongoose.model('Theater', TheaterSchema);
