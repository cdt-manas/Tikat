const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a movie title'],
        trim: true,
        maxlength: [100, 'Name can not be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please add a description'],
        maxlength: [1000, 'Description can not be more than 1000 characters']
    },
    duration: {
        type: Number,
        required: [true, 'Please add duration in minutes']
    },
    genre: {
        type: [String],
        required: true,
        enum: [
            'Action',
            'Comedy',
            'Drama',
            'Horror',
            'Romance',
            'Sci-Fi',
            'Thriller',
            'Documentary',
            'Adventure',
            'Fantasy',
            'Animation',
            'Crime',
            'Family'
        ]
    },
    language: {
        type: String,
        required: [true, 'Please add a language']
    },
    releaseDate: {
        type: Date,
        default: Date.now
    },
    posterUrl: {
        type: String,
        default: 'no-photo.jpg'
    },
    trailerUrl: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Movie', MovieSchema);
