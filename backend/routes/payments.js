const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create payment order
router.post('/create-order', auth, async (req, res) => {
  try {
    const { bookingId } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (booking.paymentStatus === 'paid') {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    const options = {
      amount: booking.totalAmount * 100, // Razorpay expects amount in paisa
      currency: 'INR',
      receipt: `booking_${booking._id}`,
      payment_capture: 1, // Auto capture
    };

    const order = await razorpay.orders.create(options);

    // Update booking with order ID
    booking.razorpayOrderId = order.id;
    await booking.save();

    res.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify payment
router.post('/verify-payment', auth, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature !== expectedSign) {
      return res.status(400).json({ message: 'Invalid payment signature' });
    }

    // Update booking payment status
    const booking = await Booking.findOne({ razorpayOrderId: razorpay_order_id });
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    booking.paymentStatus = 'paid';
    booking.razorpayPaymentId = razorpay_payment_id;
    await booking.save();

    res.json({
      message: 'Payment verified successfully',
      booking
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get payment status
router.get('/status/:bookingId', auth, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json({
      paymentStatus: booking.paymentStatus,
      razorpayOrderId: booking.razorpayOrderId,
      razorpayPaymentId: booking.razorpayPaymentId
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;