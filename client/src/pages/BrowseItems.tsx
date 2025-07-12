import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter } from 'lucide-react';
import axios from 'axios';

interface Item {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  type: string;
  size: string;
  condition: string;
  pointsValue: number;
  status: string;
  owner: {
    name: string;
  };
}

const BrowseItems = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    condition: '',
    minPoints: '',
    maxPoints: '',
  });

  useEffect(() => {
    fetchItems();
  }, [searchTerm, filters]);

  const fetchItems = async () => {
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (filters.category) params.append('category', filters.category);
      if (filters.condition) params.append('condition', filters.condition);
      if (filters.minPoints) params.append('minPoints', filters.minPoints);
      if (filters.maxPoints) params.append('maxPoints', filters.maxPoints);

      const response = await axios.get(`/api/items?${params.toString()}`);
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Browse Items</h1>
        <p className="text-gray-600 mt-2">Discover amazing pieces from our community</p>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          
          <div>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Categories</option>
              <option value="tops">Tops</option>
              <option value="bottoms">Bottoms</option>
              <option value="dresses">Dresses</option>
              <option value="outerwear">Outerwear</option>
              <option value="shoes">Shoes</option>
              <option value="accessories">Accessories</option>
            </select>
          </div>

          <div>
            <select
              value={filters.condition}
              onChange={(e) => handleFilterChange('condition', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Conditions</option>
              <option value="new">New</option>
              <option value="like-new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
            </select>
          </div>

          <div>
            <input
              type="number"
              placeholder="Min Points"
              value={filters.minPoints}
              onChange={(e) => handleFilterChange('minPoints', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Max Points"
              value={filters.maxPoints}
              onChange={(e) => handleFilterChange('maxPoints', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
        </div>
      </div>

      {/* Items Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <Link key={item._id} to={`/item/${item._id}`} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-w-4 aspect-h-3">
                  <img
                    src={item.images[0] || '/placeholder-image.jpg'}
                    alt={item.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.description}</p>
                  
                  <div className="flex items-center justify-between mb-2">
                    <span className="bg-gray-100 text-gray-800 px-2 py-1 rounded text-xs">
                      {item.category}
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${
                      item.condition === 'new' ? 'bg-green-100 text-green-800' :
                      item.condition === 'like-new' ? 'bg-blue-100 text-blue-800' :
                      item.condition === 'good' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {item.condition}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">by {item.owner.name}</span>
                    <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded text-sm font-medium">
                      {item.pointsValue} pts
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!loading && items.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No items found matching your criteria.</p>
          <Link to="/add-item" className="text-primary-600 hover:text-primary-700 font-medium">
            Be the first to list an item!
          </Link>
        </div>
      )}
    </div>
  );
};

export default BrowseItems;