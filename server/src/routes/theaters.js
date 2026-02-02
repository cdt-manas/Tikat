const express = require('express');
const {
    getTheaters,
    getTheater,
    createTheater,
    updateTheater,
    deleteTheater
} = require('../controllers/theaters');

const router = express.Router();

const { protect, authorize } = require('../middlewares/auth');

router
    .route('/')
    .get(getTheaters)
    .post(protect, authorize('admin'), createTheater);

router
    .route('/:id')
    .get(getTheater)
    .put(protect, authorize('admin'), updateTheater)
    .delete(protect, authorize('admin'), deleteTheater);

module.exports = router;
