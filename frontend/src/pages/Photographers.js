import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import { FaSearch, FaStar, FaFilter } from 'react-icons/fa';

const Photographers = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [photographers, setPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    location: searchParams.get('location') || '',
    category: searchParams.get('category') || '',
    minPrice: searchParams.get('minPrice') || '',
    maxPrice: searchParams.get('maxPrice') || '',
    rating: searchParams.get('rating') || '',
    search: searchParams.get('search') || ''
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();

        Object.entries(filters).forEach(([key, value]) => {
          if (value) params.append(key, value);
        });

        const response = await axios.get(`/api/photographers?${params}`);
        setPhotographers(response.data.photographers);
      } catch (error) {
        console.error('Error fetching photographers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotographers();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));

    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setFilters({
      location: '',
      category: '',
      minPrice: '',
      maxPrice: '',
      rating: '',
      search: ''
    });
    setSearchParams({});
  };

  const categories = [
    'wedding', 'birthday', 'corporate', 'portrait', 'event', 'fashion'
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="mb-8 rounded-3xl bg-white p-8 shadow-xl shadow-slate-200/80">
          <div className="flex flex-col lg:flex-row gap-6 justify-between items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-slate-500 mb-2">Photographer search</p>
              <h1 className="text-4xl font-bold text-slate-900">Find the perfect creative partner</h1>
              <p className="mt-3 max-w-2xl text-slate-600">Filter by location, category, price and rating to book the best photographer for your event.</p>
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
            >
              <FaFilter className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.5fr_0.5fr]">
            <div className="relative">
              <FaSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                name="search"
                placeholder="Search photographers, city or service"
                value={filters.search}
                onChange={handleFilterChange}
                className="w-full rounded-full border border-slate-200 bg-slate-100 px-14 py-4 text-slate-900 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
              />
            </div>
          </div>

          {showFilters && (
            <div className="mt-8 rounded-3xl bg-slate-50 p-6 border border-slate-200">
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Location</label>
                  <input
                    type="text"
                    name="location"
                    placeholder="City, State"
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  >
                    <option value="">All Categories</option>
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price min</label>
                  <input
                    type="number"
                    name="minPrice"
                    placeholder="₹0"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Price max</label>
                  <input
                    type="number"
                    name="maxPrice"
                    placeholder="₹15000"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  />
                </div>
              </div>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Rating</label>
                  <select
                    name="rating"
                    value={filters.rating}
                    onChange={handleFilterChange}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 focus:border-sky-500 focus:ring-4 focus:ring-sky-100"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                  </select>
                </div>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-100"
                >
                  Clear filters
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {loading ? (
            <div className="col-span-full rounded-3xl bg-white p-12 text-center shadow-lg shadow-slate-200/60">
              <div className="mx-auto mb-4 h-14 w-14 animate-spin rounded-full border-b-2 border-slate-900"></div>
              <p className="text-slate-600">Loading photographers…</p>
            </div>
          ) : photographers.length === 0 ? (
            <div className="col-span-full rounded-3xl bg-white p-12 text-center shadow-lg shadow-slate-200/60">
              <p className="text-slate-700 text-lg">No photographers found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="mt-4 inline-flex items-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
              >
                Reset filters
              </button>
            </div>
          ) : (
            photographers.map((photographer) => (
              <div key={photographer._id} className="overflow-hidden rounded-3xl bg-white shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
                <div className="relative h-64 overflow-hidden">
                  <img
                    src={photographer.portfolio?.[0]?.url || photographer.userId.profileImage || '/default-avatar.png'}
                    alt={photographer.userId.name}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 rounded-full bg-white/90 px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm">
                    {photographer.location}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={photographer.userId.profileImage || '/default-avatar.png'}
                      alt={photographer.userId.name}
                      className="h-16 w-16 rounded-3xl border-4 border-white object-cover shadow-lg"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-slate-900">{photographer.userId.name}</h3>
                      <p className="text-sm text-slate-500">{photographer.categories.slice(0, 3).join(', ')}</p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {photographer.categories.slice(0, 3).map((category, index) => (
                      <span
                        key={index}
                        className="rounded-full bg-sky-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-sky-700"
                      >
                        {category}
                      </span>
                    ))}
                  </div>

                  <p className="mt-4 text-sm text-slate-600 line-clamp-3">{photographer.bio}</p>

                  <div className="mt-6 flex items-center justify-between gap-4">
                    <div>
                      <div className="text-2xl font-bold text-slate-900">₹{photographer.price}</div>
                      <p className="text-sm text-slate-500">per session</p>
                    </div>
                    <div className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                      <FaStar className="inline mr-2 text-amber-400" />{photographer.rating.toFixed(1)}
                    </div>
                  </div>

                  <Link
                    to={`/photographer/${photographer._id}`}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Photographers;