import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { FaCalendarAlt, FaCheckCircle, FaClock, FaStar, FaRupeeSign } from 'react-icons/fa';

const Dashboard = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);

      if (user.role === 'photographer') {
        // Fetch photographer bookings and stats
        const [bookingsResponse, statsResponse] = await Promise.all([
          axios.get('/api/bookings/photographer'),
          axios.get('/api/photographers/dashboard/stats')
        ]);
        setBookings(bookingsResponse.data);
        setStats(statsResponse.data);
      } else {
        // Fetch customer bookings
        const response = await axios.get('/api/bookings/user');
        setBookings(response.data);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user, fetchDashboardData]);

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await axios.put(`/api/bookings/${bookingId}/status`, { status });
      fetchDashboardData(); // Refresh data
    } catch (error) {
      console.error('Error updating booking status:', error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {user.role === 'photographer' ? 'Manage your bookings and profile' : 'View your bookings and find photographers'}
          </p>
        </div>

        {/* Stats for Photographers */}
        {user.role === 'photographer' && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <FaCalendarAlt className="text-blue-600 text-2xl mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.totalBookings || 0}</p>
                  <p className="text-gray-600 text-sm">Total Bookings</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-600 text-2xl mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.completedBookings || 0}</p>
                  <p className="text-gray-600 text-sm">Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <FaClock className="text-yellow-600 text-2xl mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.pendingBookings || 0}</p>
                  <p className="text-gray-600 text-sm">Pending</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <FaStar className="text-yellow-500 text-2xl mr-3" />
                <div>
                  <p className="text-2xl font-bold">{stats.rating ? stats.rating.toFixed(1) : '0.0'}</p>
                  <p className="text-gray-600 text-sm">Rating</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('bookings')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'bookings'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                My Bookings
              </button>
              {user.role === 'photographer' && (
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`px-6 py-4 text-sm font-medium ${
                    activeTab === 'profile'
                      ? 'border-b-2 border-blue-500 text-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Profile Settings
                </button>
              )}
            </nav>
          </div>
        </div>

        {/* Bookings List */}
        {activeTab === 'bookings' && (
          <div className="bg-white rounded-lg shadow">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-4">
                {user.role === 'photographer' ? 'Client Bookings' : 'My Bookings'}
              </h2>

              {bookings.length === 0 ? (
                <p className="text-gray-600 text-center py-8">
                  {user.role === 'photographer' ? 'No bookings yet.' : 'You haven\'t made any bookings yet.'}
                </p>
              ) : (
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div key={booking._id} className="border border-gray-200 rounded-lg p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <h3 className="text-lg font-semibold mr-4">
                              {user.role === 'photographer' ? booking.userId.name : booking.photographerId.userId.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                              {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                            <div className="flex items-center">
                              <FaCalendarAlt className="mr-2" />
                              <span>{new Date(booking.date).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center">
                              <FaClock className="mr-2" />
                              <span>{booking.duration} hours</span>
                            </div>
                            <div className="flex items-center">
                              <FaRupeeSign className="mr-2" />
                              <span>{booking.totalAmount}</span>
                            </div>
                          </div>

                          <p className="text-gray-600 mt-2">
                            <strong>Event:</strong> {booking.eventType} • <strong>Location:</strong> {booking.location}
                          </p>

                          {booking.specialRequests && (
                            <p className="text-gray-600 mt-1">
                              <strong>Special Requests:</strong> {booking.specialRequests}
                            </p>
                          )}

                          <div className="mt-4">
                            <Link
                              to={`/booking-confirmation/${booking._id}`}
                              className="inline-flex items-center rounded-full border border-blue-200 bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700 hover:bg-blue-100"
                            >
                              View booking details
                            </Link>
                          </div>
                        </div>

                        {user.role === 'photographer' && booking.status === 'pending' && (
                          <div className="flex space-x-2 mt-4 md:mt-0">
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                              className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
                            >
                              Decline
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Settings for Photographers */}
        {activeTab === 'profile' && user.role === 'photographer' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold mb-4">Profile Settings</h2>
            <p className="text-gray-600">Profile management features will be implemented here.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;