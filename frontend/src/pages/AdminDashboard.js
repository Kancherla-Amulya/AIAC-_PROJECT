import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAdminStats();
    }
  }, [user]);

  const fetchAdminStats = async () => {
    try {
      // This would typically fetch admin stats from the backend
      // For now, we'll show placeholder data
      setStats({
        totalUsers: 150,
        totalPhotographers: 45,
        totalBookings: 89,
        totalRevenue: 125000
      });
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
          <p className="text-gray-600">You don't have permission to access this page.</p>
        </div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, bookings, and platform statistics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">{stats.totalUsers}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Photographers</h3>
            <p className="text-3xl font-bold text-green-600">{stats.totalPhotographers}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Bookings</h3>
            <p className="text-3xl font-bold text-purple-600">{stats.totalBookings}</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-yellow-600">₹{stats.totalRevenue?.toLocaleString()}</p>
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">User Management</h3>
            <p className="text-gray-600 mb-4">Manage user accounts and permissions</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Manage Users
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Booking Management</h3>
            <p className="text-gray-600 mb-4">Monitor and manage all bookings</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Manage Bookings
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Content Moderation</h3>
            <p className="text-gray-600 mb-4">Review photographer profiles and portfolios</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              Moderate Content
            </button>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-xl font-semibold mb-4">Reports & Analytics</h3>
            <p className="text-gray-600 mb-4">View platform analytics and reports</p>
            <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
              View Reports
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;