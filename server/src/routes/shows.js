const express = require('express');
const {
    getShows,
    getShow,
    createShow,
    deleteShow
} = require('../controllers/shows');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

router
    .route('/')
    .get(getShows)
    .post(protect, authorize('admin'), createShow);

router
    .route('/:id')
    .get(getShow)
    .delete(protect, authorize('admin'), deleteShow);

module.exports = router;
