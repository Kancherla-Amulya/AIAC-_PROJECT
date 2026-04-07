const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
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
  date: {
    type: Date,
    required: true
  },
  eventType: {
    type: String,
    required: true,
    enum: ['wedding', 'birthday', 'corporate', 'portrait', 'event', 'fashion', 'other']
  },
  duration: {
    type: Number, // in hours
    default: 4
  },
  location: {
    type: String,
    required: true
  },
  specialRequests: {
    type: String,
    maxlength: 1000
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
    default: 'pending'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'refunded'],
    default: 'pending'
  },
  totalAmount: {
    type: Number,
    required: true
  },
  razorpayOrderId: String,
  razorpayPaymentId: String,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
bookingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);