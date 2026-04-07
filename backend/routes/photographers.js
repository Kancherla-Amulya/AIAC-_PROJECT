const express = require('express');
const { body, validationResult } = require('express-validator');
const Photographer = require('../models/Photographer');
const User = require('../models/User');
const Review = require('../models/Review');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// Get all photographers with filters
router.get('/', async (req, res) => {
  try {
    const {
      location,
      category,
      minPrice,
      maxPrice,
      rating,
      search,
      page = 1,
      limit = 10
    } = req.query;

    let query = { isActive: true };

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Category filter
    if (category) {
      query.categories = category;
    }

    // Price filter
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }

    // Rating filter
    if (rating) {
      query.rating = { $gte: parseFloat(rating) };
    }

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    const photographers = await Photographer.find(query)
      .populate('userId', 'name email profileImage')
      .sort({ rating: -1, createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Photographer.countDocuments(query);

    res.json({
      photographers,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get photographer by ID
router.get('/:id', async (req, res) => {
  try {
    const photographer = await Photographer.findById(req.params.id)
      .populate('userId', 'name email profileImage phone location');

    if (!photographer) {
      return res.status(404).json({ message: 'Photographer not found' });
    }

    // Get reviews
    const reviews = await Review.find({ photographerId: req.params.id })
      .populate('userId', 'name profileImage')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({ photographer, reviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create photographer profile
router.post('/', auth, requireRole('photographer'), [
  body('bio').optional().isLength({ max: 500 }).withMessage('Bio must be less than 500 characters'),
  body('location').notEmpty().withMessage('Location is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('categories').isArray().withMessage('Categories must be an array'),
  body('experience').optional().isNumeric().withMessage('Experience must be a number')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if photographer profile already exists
    const existingPhotographer = await Photographer.findOne({ userId: req.user._id });
    if (existingPhotographer) {
      return res.status(400).json({ message: 'Photographer profile already exists' });
    }

    const photographer = new Photographer({
      userId: req.user._id,
      ...req.body
    });

    await photographer.save();

    res.status(201).json({
      message: 'Photographer profile created successfully',
      photographer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update photographer profile
router.put('/:id', auth, requireRole('photographer'), async (req, res) => {
  try {
    const photographer = await Photographer.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!photographer) {
      return res.status(404).json({ message: 'Photographer profile not found' });
    }

    const updates = {};
    const allowedFields = [
      'bio', 'location', 'price', 'categories', 'experience',
      'equipment', 'socialLinks', 'portfolio'
    ];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const updatedPhotographer = await Photographer.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    ).populate('userId', 'name email profileImage');

    res.json({
      message: 'Profile updated successfully',
      photographer: updatedPhotographer
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get photographer dashboard data
router.get('/dashboard/stats', auth, requireRole('photographer'), async (req, res) => {
  try {
    const photographer = await Photographer.findOne({ userId: req.user._id });
    if (!photographer) {
      return res.status(404).json({ message: 'Photographer profile not found' });
    }

    // Get booking stats
    const totalBookings = await require('../models/Booking').countDocuments({
      photographerId: photographer._id
    });

    const completedBookings = await require('../models/Booking').countDocuments({
      photographerId: photographer._id,
      status: 'completed'
    });

    const pendingBookings = await require('../models/Booking').countDocuments({
      photographerId: photographer._id,
      status: 'pending'
    });

    res.json({
      totalBookings,
      completedBookings,
      pendingBookings,
      rating: photographer.rating,
      totalReviews: photographer.totalReviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;