import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, Star, MapPin, Calendar, Tag } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

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
  tags: string[];
  createdAt: string;
  owner: {
    _id: string;
    name: string;
    email: string;
  };
}

const ItemDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchItem();
    }
  }, [id]);

  const fetchItem = async () => {
    try {
      const response = await axios.get(`/api/items/${id}`);
      setItem(response.data);
    } catch (error) {
      console.error('Error fetching item:', error);
      toast.error('Item not found');
      navigate('/browse');
    } finally {
      setLoading(false);
    }
  };

  const handleSwapRequest = async () => {
    if (!user) {
      toast.error('Please login to make a swap request');
      navigate('/login');
      return;
    }

    try {
      await axios.post('/api/swaps', {
        requestedItemId: item?._id,
      });
      toast.success('Swap request sent successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to send swap request');
    }
  };

  const handleRedeemPoints = async () => {
    if (!user) {
      toast.error('Please login to redeem points');
      navigate('/login');
      return;
    }

    if (user.points < (item?.pointsValue || 0)) {
      toast.error('Insufficient points to redeem this item');
      return;
    }

    try {
      await axios.post(`/api/items/${item?._id}/redeem`);
      toast.success('Item redeemed successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to redeem item');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-center text-gray-600">Item not found</p>
      </div>
    );
  }

  const isOwner = user?._id === item.owner._id;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button
        onClick={() => navigate('/browse')}
        className="flex items-center text-gray-600 hover:text-primary-600 mb-6"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Back to Browse
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image Gallery */}
        <div>
          <div className="aspect-w-1 aspect-h-1 mb-4">
            <img
              src={item.images[currentImageIndex] || '/placeholder-image.jpg'}
              alt={item.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          {item.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {item.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    currentImageIndex === index ? 'border-primary-600' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${item.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Item Details */}
        <div>
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{item.title}</h1>
            <div className="flex items-center space-x-4 mb-4">
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                item.status === 'available' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {item.status}
              </span>
              <span className="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                {item.pointsValue} points
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
              <p className="text-gray-700">{item.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-gray-900">Category</h4>
                <p className="text-gray-600">{item.category}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Type</h4>
                <p className="text-gray-600">{item.type}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Size</h4>
                <p className="text-gray-600">{item.size}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900">Condition</h4>
                <p className="text-gray-600 capitalize">{item.condition}</p>
              </div>
            </div>

            {item.tags.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {item.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="border-t pt-6">
              <h4 className="font-medium text-gray-900 mb-2">Owner Information</h4>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-primary-600 font-medium text-sm">
                    {item.owner.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700">{item.owner.name}</span>
              </div>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                Listed on {new Date(item.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Action Buttons */}
            {!isOwner && item.status === 'available' && (
              <div className="flex space-x-4 pt-6 border-t">
                <button
                  onClick={handleSwapRequest}
                  className="flex-1 bg-primary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-primary-700 transition-colors"
                >
                  Send Swap Request
                </button>
                <button
                  onClick={handleRedeemPoints}
                  disabled={!user || user.points < item.pointsValue}
                  className="flex-1 bg-secondary-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-secondary-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Redeem with Points
                </button>
              </div>
            )}

            {isOwner && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800">This is your item.</p>
              </div>
            )}

            {item.status !== 'available' && (
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-600">This item is no longer available.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;