import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaStar } from 'react-icons/fa';

const Home = () => {
  const [featuredPhotographers, setFeaturedPhotographers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedPhotographers();
  }, []);

  const fetchFeaturedPhotographers = async () => {
    try {
      const response = await axios.get('/api/photographers?limit=6&rating=4');
      setFeaturedPhotographers(response.data.photographers);
    } catch (error) {
      console.error('Error fetching photographers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    window.location.href = `/photographers?search=${encodeURIComponent(searchTerm)}`;
  };

  const categories = [
    { name: 'Wedding', icon: '💍', count: '150+' },
    { name: 'Birthday', icon: '🎂', count: '200+' },
    { name: 'Corporate', icon: '🏢', count: '100+' },
    { name: 'Portrait', icon: '📸', count: '300+' },
    { name: 'Event', icon: '🎉', count: '180+' },
    { name: 'Fashion', icon: '👗', count: '120+' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-slate-900 via-indigo-700 to-sky-600 text-white py-24">
        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.25),_transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.18),_transparent_25%)]" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <p className="inline-flex items-center rounded-full bg-white/10 px-4 py-2 text-sm uppercase tracking-[0.2em] text-white/80 mb-6">
            Discover top photographers across India
          </p>
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight mb-6">
            Capture your moments with the perfect photographer
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto text-slate-100/90 mb-10">
            Browse curated profiles, compare ratings, and book trusted photographers for weddings, portraits, events, and more.
          </p>

          <form onSubmit={handleSearch} className="mx-auto max-w-2xl">
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                placeholder="Search by city, category or name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-3xl border border-white/20 bg-white/95 px-5 py-4 text-slate-900 shadow-lg shadow-slate-900/10 focus:border-white focus:ring-4 focus:ring-white/20"
              />
              <button
                type="submit"
                className="rounded-3xl bg-amber-400 px-6 py-4 font-semibold text-slate-900 transition hover:bg-amber-300 shadow-lg shadow-amber-400/20"
              >
                <FaSearch className="inline mr-2" />
                Search
              </button>
            </div>
          </form>

          <div className="mt-10 flex flex-wrap justify-center gap-4 text-sm text-white/80">
            <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2">Fast Booking</span>
            <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2">Verified Pros</span>
            <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2">Secure Payment</span>
            <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2">24/7 Support</span>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-slate-600 mb-2">Popular Categories</p>
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Find experts by photography style</h2>
            </div>
            <Link
              to="/photographers"
              className="inline-flex items-center rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-slate-900/10 hover:bg-slate-800 transition"
            >
              Browse all photographers
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category, index) => (
              <Link
                key={index}
                to={`/photographers?category=${category.name.toLowerCase()}`}
                className="group overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="text-4xl mb-4 transition group-hover:scale-110">{category.icon}</div>
                <h3 className="font-semibold text-slate-900 mb-2">{category.name}</h3>
                <p className="text-sm text-slate-500">{category.count} photographers</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Photographers */}
      <section className="py-16 bg-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-12 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-600 mb-2">Top rated</p>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Featured photographers to inspire your shoot</h2>
          </div>

          {loading ? (
            <div className="text-center">Loading...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPhotographers.map((photographer) => (
                <div key={photographer._id} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={photographer.portfolio?.[0]?.url || photographer.userId.profileImage || '/default-avatar.png'}
                      alt={photographer.userId.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-900/90 to-transparent px-5 py-4">
                      <p className="text-xs uppercase tracking-[0.2em] text-slate-200">{photographer.location}</p>
                      <h3 className="text-xl font-semibold text-white">{photographer.userId.name}</h3>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4 gap-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={photographer.userId.profileImage || '/default-avatar.png'}
                          alt={photographer.userId.name}
                          className="h-12 w-12 rounded-full object-cover border border-slate-200"
                        />
                        <div>
                          <div className="flex items-center gap-2 text-sm text-slate-500">
                            <FaStar className="text-amber-400" />
                            <span>{photographer.rating.toFixed(1)} • {photographer.totalReviews} reviews</span>
                          </div>
                          <p className="text-sm text-slate-500">{photographer.categories.slice(0, 2).join(', ')}</p>
                        </div>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-700">₹{photographer.price}</span>
                    </div>

                    <p className="text-sm text-slate-600 mb-5 line-clamp-2">{photographer.bio}</p>

                    <Link
                      to={`/photographer/${photographer._id}`}
                      className="inline-flex items-center justify-center w-full rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;