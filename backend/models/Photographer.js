const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  bio: {
    type: String,
    maxlength: 500
  },
  location: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  portfolio: [{
    url: String,
    publicId: String,
    caption: String
  }],
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5
  },
  totalReviews: {
    type: Number,
    default: 0
  },
  categories: [{
    type: String,
    enum: ['wedding', 'birthday', 'corporate', 'portrait', 'event', 'fashion']
  }],
  availability: [{
    date: Date,
    available: {
      type: Boolean,
      default: true
    }
  }],
  experience: {
    type: Number,
    default: 0
  },
  equipment: [String],
  socialLinks: {
    instagram: String,
    website: String,
    facebook: String
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Index for search
photographerSchema.index({ location: 'text', bio: 'text', categories: 'text' });

module.exports = mongoose.model('Photographer', photographerSchema);