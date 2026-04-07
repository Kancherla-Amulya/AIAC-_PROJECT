const express = require('express');
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Photographer = require('../models/Photographer');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Create booking
router.post('/', auth, [
  body('photographerId').isMongoId().withMessage('Invalid photographer ID'),
  body('date').isISO8601().withMessage('Invalid date format'),
  body('eventType').isIn(['wedding', 'birthday', 'corporate', 'portrait', 'event', 'fashion', 'other']).withMessage('Invalid event type'),
  body('location').notEmpty().withMessage('Location is required'),
  body('duration').optional().isNumeric().withMessage('Duration must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { photographerId, date, eventType, location, duration = 4, specialRequests } = req.body;

    // Check if photographer exists and is active
    const photographer = await Photographer.findById(photographerId);
    if (!photographer || !photographer.isActive) {
      return res.status(404).json({ message: 'Photographer not found or inactive' });
    }

    // Check if date is available
    const bookingDate = new Date(date);
    const availability = photographer.availability.find(
      avail => avail.date.toDateString() === bookingDate.toDateString()
    );

    if (availability && !availability.available) {
      return res.status(400).json({ message: 'Photographer not available on this date' });
    }

    // Calculate total amount
    const totalAmount = photographer.price * duration;

    const booking = new Booking({
      userId: req.user._id,
      photographerId,
      date: bookingDate,
      eventType,
      duration,
      location,
      specialRequests,
      totalAmount
    });

    await booking.save();

    // Update photographer availability
    if (!availability) {
      photographer.availability.push({ date: bookingDate, available: false });
    } else {
      availability.available = false;
    }
    await photographer.save();

    res.status(201).json({
      message: 'Booking created successfully',
      booking: await booking.populate(['userId', 'photographerId'])
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's bookings
router.get('/user', auth, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('photographerId', 'userId price')
      .populate('photographerId.userId', 'name email profileImage')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get photographer's bookings
router.get('/photographer', auth, requireRole('photographer'), async (req, res) => {
  try {
    const photographer = await Photographer.findOne({ userId: req.user._id });
    if (!photographer) {
      return res.status(404).json({ message: 'Photographer profile not found' });
    }

    const bookings = await Booking.find({ photographerId: photographer._id })
      .populate('userId', 'name email phone profileImage')
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update booking status
router.put('/:id/status', auth, [
  body('status').isIn(['confirmed', 'in-progress', 'completed', 'cancelled']).withMessage('Invalid status')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions
    const isCustomer = booking.userId.toString() === req.user._id.toString();
    const photographer = await Photographer.findOne({ userId: req.user._id });
    const isPhotographer = photographer && booking.photographerId.toString() === photographer._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isPhotographer && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    // Business logic for status changes
    const { status } = req.body;
    const oldStatus = booking.status;

    if (status === 'confirmed' && !isPhotographer && !isAdmin) {
      return res.status(403).json({ message: 'Only photographer can confirm booking' });
    }

    if (status === 'cancelled' && oldStatus === 'completed') {
      return res.status(400).json({ message: 'Cannot cancel completed booking' });
    }

    booking.status = status;
    await booking.save();

    // If cancelled, make date available again
    if (status === 'cancelled' && oldStatus !== 'cancelled') {
      const photographerProfile = await Photographer.findById(booking.photographerId);
      const availability = photographerProfile.availability.find(
        avail => avail.date.toDateString() === booking.date.toDateString()
      );
      if (availability) {
        availability.available = true;
        await photographerProfile.save();
      }
    }

    res.json({
      message: 'Booking status updated successfully',
      booking: await booking.populate(['userId', 'photographerId'])
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get booking by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('userId', 'name email phone profileImage')
      .populate('photographerId')
      .populate('photographerId.userId', 'name email profileImage phone');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Check permissions
    const isCustomer = booking.userId.toString() === req.user._id.toString();
    const photographer = await Photographer.findOne({ userId: req.user._id });
    const isPhotographer = photographer && booking.photographerId.toString() === photographer._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isCustomer && !isPhotographer && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized to view this booking' });
    }

    res.json(booking);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;