import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plus, Package, ArrowRightLeft, Award } from 'lucide-react';
import axios from 'axios';

interface Item {
  _id: string;
  title: string;
  images: string[];
  category: string;
  condition: string;
  status: string;
  pointsValue: number;
}

interface Swap {
  _id: string;
  requestedItem: Item;
  offeredItem: Item;
  status: string;
  createdAt: string;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [userItems, setUserItems] = useState<Item[]>([]);
  const [userSwaps, setUserSwaps] = useState<Swap[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const [itemsResponse, swapsResponse] = await Promise.all([
        axios.get('/api/items/user'),
        axios.get('/api/swaps/user'),
      ]);

      setUserItems(itemsResponse.data.items || []);
      setUserSwaps(swapsResponse.data.swaps || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
        <p className="text-gray-600 mt-2">Manage your items and track your swaps</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-primary-100 rounded-lg">
              <Award className="h-6 w-6 text-primary-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Points</p>
              <p className="text-2xl font-bold text-gray-900">{user?.points || 0}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Listed Items</p>
              <p className="text-2xl font-bold text-gray-900">{userItems.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <ArrowRightLeft className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Swaps</p>
              <p className="text-2xl font-bold text-gray-900">
                {userSwaps.filter(swap => swap.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <Link
            to="/add-item"
            className="flex items-center justify-center w-full h-full text-primary-600 hover:text-primary-700 border-2 border-dashed border-primary-300 hover:border-primary-400 rounded-lg transition-colors"
          >
            <div className="text-center">
              <Plus className="h-8 w-8 mx-auto mb-2" />
              <p className="font-medium">Add New Item</p>
            </div>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* My Items */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">My Items</h2>
          </div>
          <div className="p-6">
            {userItems.length > 0 ? (
              <div className="space-y-4">
                {userItems.slice(0, 5).map((item) => (
                  <div key={item._id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <img
                      src={item.images[0] || '/placeholder-image.jpg'}
                      alt={item.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.category} • {item.condition}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className={`px-2 py-1 text-xs rounded ${
                          item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.status}
                        </span>
                        <span className="text-xs text-gray-500">{item.pointsValue} points</span>
                      </div>
                    </div>
                  </div>
                ))}
                {userItems.length > 5 && (
                  <p className="text-center text-gray-500">And {userItems.length - 5} more items...</p>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No items listed yet</p>
                <Link to="/add-item" className="text-primary-600 hover:text-primary-700 font-medium">
                  List your first item
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Recent Swaps */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Swaps</h2>
          </div>
          <div className="p-6">
            {userSwaps.length > 0 ? (
              <div className="space-y-4">
                {userSwaps.slice(0, 5).map((swap) => (
                  <div key={swap._id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className={`px-2 py-1 text-xs rounded ${
                        swap.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        swap.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {swap.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(swap.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <span className="font-medium">{swap.offeredItem.title}</span>
                      <ArrowRightLeft className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{swap.requestedItem.title}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <ArrowRightLeft className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No swaps yet</p>
                <Link to="/browse" className="text-primary-600 hover:text-primary-700 font-medium">
                  Browse items to start swapping
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;