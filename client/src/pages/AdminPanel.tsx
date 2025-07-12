import React, { useEffect, useState } from 'react';
import { Check, X, Eye, Users, Package, AlertTriangle } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

interface PendingItem {
  _id: string;
  title: string;
  description: string;
  images: string[];
  category: string;
  condition: string;
  status: string;
  owner: {
    name: string;
    email: string;
  };
  createdAt: string;
}

interface Stats {
  totalUsers: number;
  totalItems: number;
  pendingItems: number;
  totalSwaps: number;
}

const AdminPanel = () => {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    totalItems: 0,
    pendingItems: 0,
    totalSwaps: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const [itemsResponse, statsResponse] = await Promise.all([
        axios.get('/api/admin/pending-items'),
        axios.get('/api/admin/stats'),
      ]);

      setPendingItems(itemsResponse.data.items || []);
      setStats(statsResponse.data || {});
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast.error('Failed to load admin data');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveItem = async (itemId: string) => {
    try {
      await axios.patch(`/api/admin/items/${itemId}/approve`);
      toast.success('Item approved successfully');
      fetchAdminData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to approve item');
    }
  };

  const handleRejectItem = async (itemId: string) => {
    try {
      await axios.patch(`/api/admin/items/${itemId}/reject`);
      toast.success('Item rejected successfully');
      fetchAdminData();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to reject item');
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
        <h1 className="text-3xl font-bold text-gray-900">Admin Panel</h1>
        <p className="text-gray-600 mt-2">Manage items and oversee platform activity</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <Package className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Items</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Pending Approval</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pendingItems}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Eye className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Swaps</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalSwaps}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Pending Items */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Pending Item Approvals</h2>
        </div>
        <div className="p-6">
          {pendingItems.length > 0 ? (
            <div className="space-y-6">
              {pendingItems.map((item) => (
                <div key={item._id} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-start space-x-4">
                    <img
                      src={item.images[0] || '/placeholder-image.jpg'}
                      alt={item.title}
                      className="w-20 h-20 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-gray-600 mt-1">{item.description}</p>
                      <div className="flex items-center space-x-4 mt-2 text-sm text-gray-500">
                        <span>Category: {item.category}</span>
                        <span>Condition: {item.condition}</span>
                        <span>By: {item.owner.name}</span>
                        <span>Listed: {new Date(item.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleApproveItem(item._id)}
                        className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectItem(item._id)}
                        className="flex items-center px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No items pending approval</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;