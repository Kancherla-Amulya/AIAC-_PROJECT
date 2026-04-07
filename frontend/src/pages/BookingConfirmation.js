import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaCheckCircle, FaRupeeSign } from 'react-icons/fa';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'confirmed':
      return 'bg-blue-100 text-blue-800';
    case 'in-progress':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const BookingConfirmation = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axios.get(`/api/bookings/${bookingId}`);
        setBooking(response.data);
      } catch (err) {
        console.error('Error loading booking confirmation:', err);
        setError('Unable to load booking details.');
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-xl bg-white rounded-3xl shadow-lg p-8 text-center">
          <h2 className="text-2xl font-semibold text-slate-900 mb-4">Booking Confirmation</h2>
          <p className="text-slate-600">{error || 'Booking not found.'}</p>
          <Link to="/dashboard" className="mt-6 inline-flex rounded-full bg-slate-900 px-6 py-3 text-white hover:bg-slate-800">
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const photographerName = booking.photographerId?.userId?.name || 'Photographer';
  const customerName = booking.userId?.name || 'Your booking';

  return (
    <div className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="rounded-3xl bg-white p-10 shadow-2xl border border-slate-200">
          <div className="flex flex-col items-center text-center gap-4 mb-10">
            <div className="rounded-full bg-green-100 p-4 text-green-700">
              <FaCheckCircle className="text-4xl" />
            </div>
            <h1 className="text-4xl font-bold text-slate-900">Booking Confirmed</h1>
            <p className="max-w-2xl text-slate-600">
              Thank you, {customerName}! Your booking with {photographerName} has been created successfully.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Booking Details</h2>
              <div className="space-y-3 text-slate-700">
                <p>
                  <span className="font-medium">Booking ID:</span> {booking._id}
                </p>
                <p>
                  <span className="font-medium">Photographer:</span> {photographerName}
                </p>
                <p>
                  <span className="font-medium">Event Type:</span> {booking.eventType}
                </p>
                <p>
                  <span className="font-medium">Date:</span> {new Date(booking.date).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium">Location:</span> {booking.location}
                </p>
                <p>
                  <span className="font-medium">Duration:</span> {booking.duration} hours
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Payment & Status</h2>
              <div className="space-y-3 text-slate-700">
                <p>
                  <span className="font-medium">Amount:</span> <FaRupeeSign className="inline" /> {booking.totalAmount}
                </p>
                <p>
                  <span className="font-medium">Current Status:</span>
                  <span className={`ml-2 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${getStatusColor(booking.status)}`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </span>
                </p>
                <p>
                  <span className="font-medium">Payment Status:</span> {booking.paymentStatus}
                </p>
                {booking.specialRequests && (
                  <p>
                    <span className="font-medium">Special Requests:</span> {booking.specialRequests}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/dashboard" className="inline-flex rounded-full bg-slate-900 px-6 py-3 text-white font-semibold hover:bg-slate-800">
              View Dashboard
            </Link>
            <Link to="/photographers" className="inline-flex rounded-full border border-slate-300 bg-white px-6 py-3 text-slate-800 font-semibold hover:bg-slate-50">
              Book another photographer
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
