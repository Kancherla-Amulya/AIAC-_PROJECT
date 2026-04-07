import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { FaCalendarAlt, FaMapMarkerAlt, FaStar } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Booking = () => {
  const { photographerId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [photographer, setPhotographer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingData, setBookingData] = useState({
    date: null,
    eventType: '',
    duration: 4,
    location: '',
    specialRequests: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchPhotographer = async () => {
      try {
        const response = await axios.get(`/api/photographers/${photographerId}`);
        setPhotographer(response.data.photographer);
      } catch (error) {
        console.error('Error fetching photographer:', error);
        setError('Failed to load photographer details');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotographer();
  }, [user, navigate, photographerId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date) => {
    setBookingData(prev => ({
      ...prev,
      date
    }));
  };

  const calculateTotal = () => {
    if (!photographer) return 0;
    return photographer.price * bookingData.duration;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const response = await axios.post('/api/bookings', {
        photographerId,
        ...bookingData,
        date: bookingData.date.toISOString()
      });

      // Redirect to payment or booking confirmation
      navigate(`/booking/${response.data.booking._id}/payment`);
    } catch (error) {
      console.error('Error creating booking:', error);
      setError(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!photographer) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Photographer not found</h2>
          <p className="text-gray-600">The photographer you're trying to book doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Book {photographer.userId.name}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Booking Details</h2>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Event Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Type *
                  </label>
                  <select
                    name="eventType"
                    value={bookingData.eventType}
                    onChange={handleInputChange}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select event type</option>
                    <option value="wedding">Wedding</option>
                    <option value="birthday">Birthday</option>
                    <option value="corporate">Corporate Event</option>
                    <option value="portrait">Portrait Session</option>
                    <option value="event">Other Event</option>
                    <option value="fashion">Fashion Shoot</option>
                  </select>
                </div>

                {/* Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Date *
                  </label>
                  <div className="relative">
                    <DatePicker
                      selected={bookingData.date}
                      onChange={handleDateChange}
                      minDate={new Date()}
                      dateFormat="MMMM d, yyyy"
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholderText="Select event date"
                      required
                    />
                    <FaCalendarAlt className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                {/* Duration */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Duration (hours) *
                  </label>
                  <select
                    name="duration"
                    value={bookingData.duration}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value={2}>2 hours</option>
                    <option value={4}>4 hours</option>
                    <option value={6}>6 hours</option>
                    <option value={8}>8 hours</option>
                    <option value={12}>Full day (12 hours)</option>
                  </select>
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Location *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="location"
                      value={bookingData.location}
                      onChange={handleInputChange}
                      placeholder="Enter event location"
                      required
                      className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <FaMapMarkerAlt className="absolute left-3 top-3 text-gray-400" />
                  </div>
                </div>

                {/* Special Requests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requests
                  </label>
                  <textarea
                    name="specialRequests"
                    value={bookingData.specialRequests}
                    onChange={handleInputChange}
                    rows={4}
                    placeholder="Any special requirements or notes..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Creating Booking...' : 'Proceed to Payment'}
                </button>
              </form>
            </div>
          </div>

          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h3 className="text-lg font-semibold mb-4">Booking Summary</h3>

              <div className="space-y-4">
                <div className="flex items-center">
                  <img
                    src={photographer.userId.profileImage || '/default-avatar.png'}
                    alt={photographer.userId.name}
                    className="w-12 h-12 rounded-full mr-3"
                  />
                  <div>
                    <h4 className="font-semibold">{photographer.userId.name}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <FaStar className="text-yellow-500 mr-1" />
                      <span>{photographer.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Rate per hour</span>
                    <span className="font-semibold">₹{photographer.price}</span>
                  </div>

                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Duration</span>
                    <span>{bookingData.duration} hours</span>
                  </div>

                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between items-center text-lg font-bold">
                      <span>Total Amount</span>
                      <span className="text-blue-600">₹{calculateTotal()}</span>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  <p className="font-semibold mb-1">What's included:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>Professional photography</li>
                    <li>Edited photos delivery</li>
                    <li>Travel within city limits</li>
                    <li>Basic photo editing</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Booking;