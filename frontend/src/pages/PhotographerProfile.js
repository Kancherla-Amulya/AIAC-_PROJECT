import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaStar, FaMapMarkerAlt, FaEnvelope, FaPhone } from 'react-icons/fa';

const PhotographerProfile = () => {
  const { id } = useParams();
  const [photographer, setPhotographer] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    const fetchPhotographerProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/photographers/${id}`);
        setPhotographer(response.data.photographer);
        setReviews(response.data.reviews);
      } catch (error) {
        console.error('Error fetching photographer profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotographerProfile();
  }, [id]);

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
          <p className="text-gray-600">The photographer you're looking for doesn't exist.</p>
          <Link to="/photographers" className="text-blue-600 hover:text-blue-800 mt-4 inline-block">
            Back to photographers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="flex flex-col md:flex-row items-start md:items-center">
            <img
              src={photographer.userId.profileImage || '/default-avatar.png'}
              alt={photographer.userId.name}
              className="w-32 h-32 rounded-full object-cover mb-4 md:mb-0 md:mr-8"
            />

            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{photographer.userId.name}</h1>

              <div className="flex items-center mb-3">
                <FaStar className="text-yellow-500 mr-1" />
                <span className="text-lg font-semibold mr-2">{photographer.rating.toFixed(1)}</span>
                <span className="text-gray-600">({photographer.totalReviews} reviews)</span>
              </div>

              <div className="flex items-center text-gray-600 mb-3">
                <FaMapMarkerAlt className="mr-2" />
                <span>{photographer.location}</span>
              </div>

              <div className="flex items-center text-gray-600 mb-4">
                <span className="font-semibold text-2xl text-blue-600">₹{photographer.price}</span>
                <span className="text-gray-500 ml-1">per session</span>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {photographer.categories.map((category, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </span>
                ))}
              </div>

              <Link
                to={`/booking/${photographer._id}`}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300"
              >
                Book Now
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex">
              <button
                onClick={() => setActiveTab('about')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'about'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                About
              </button>
              <button
                onClick={() => setActiveTab('portfolio')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'portfolio'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Portfolio
              </button>
              <button
                onClick={() => setActiveTab('reviews')}
                className={`px-6 py-4 text-sm font-medium ${
                  activeTab === 'reviews'
                    ? 'border-b-2 border-blue-500 text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                Reviews ({reviews.length})
              </button>
            </nav>
          </div>

          <div className="p-8">
            {activeTab === 'about' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">About {photographer.userId.name}</h3>
                <p className="text-gray-700 mb-6">{photographer.bio}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Experience</h4>
                    <p className="text-gray-600">{photographer.experience} years</p>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Contact Information</h4>
                    <div className="space-y-2">
                      <div className="flex items-center text-gray-600">
                        <FaEnvelope className="mr-2" />
                        <span>{photographer.userId.email}</span>
                      </div>
                      {photographer.userId.phone && (
                        <div className="flex items-center text-gray-600">
                          <FaPhone className="mr-2" />
                          <span>{photographer.userId.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {photographer.equipment && photographer.equipment.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold mb-3">Equipment</h4>
                    <div className="flex flex-wrap gap-2">
                      {photographer.equipment.map((item, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm"
                        >
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'portfolio' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Portfolio</h3>
                {photographer.portfolio && photographer.portfolio.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {photographer.portfolio.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image.url}
                          alt={image.caption || `Portfolio image ${index + 1}`}
                          className="w-full h-64 object-cover rounded-lg"
                        />
                        {image.caption && (
                          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition duration-300 rounded-lg flex items-center justify-center">
                            <p className="text-white opacity-0 group-hover:opacity-100 transition duration-300 text-center px-4">
                              {image.caption}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No portfolio images available yet.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <h3 className="text-xl font-semibold mb-4">Reviews</h3>
                {reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <div key={review._id} className="border-b border-gray-200 pb-6 last:border-b-0">
                        <div className="flex items-center mb-3">
                          <img
                            src={review.userId.profileImage || '/default-avatar.png'}
                            alt={review.userId.name}
                            className="w-10 h-10 rounded-full mr-3"
                          />
                          <div>
                            <h4 className="font-semibold">{review.userId.name}</h4>
                            <div className="flex items-center">
                              {[...Array(5)].map((_, i) => (
                                <FaStar
                                  key={i}
                                  className={`${
                                    i < review.rating ? 'text-yellow-500' : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="ml-2 text-sm text-gray-600">
                                {new Date(review.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No reviews yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhotographerProfile;