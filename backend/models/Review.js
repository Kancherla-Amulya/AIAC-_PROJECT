const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  photographerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Photographer',
    required: true
  },
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  },
  images: [{
    url: String,
    publicId: String
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Ensure one review per booking
reviewSchema.index({ bookingId: 1 }, { unique: true });

module.exports = mongoose.model('Review', reviewSchema);