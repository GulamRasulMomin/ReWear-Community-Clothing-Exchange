import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, X } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const AddItem = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: '',
    size: '',
    condition: '',
    tags: '',
  });
  const [images, setImages] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageAdd = () => {
    // For demo purposes, we'll add placeholder images
    const placeholderImages = [
      'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg',
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg',
      'https://images.pexels.com/photos/1656684/pexels-photo-1656684.jpeg',
    ];
    
    if (images.length < 5) {
      const randomImage = placeholderImages[Math.floor(Math.random() * placeholderImages.length)];
      setImages([...images, randomImage]);
    }
  };

  const handleImageRemove = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error('Please add at least one image');
      return;
    }

    setLoading(true);

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await axios.post('/api/items', {
        ...formData,
        images,
        tags: tagsArray,
      });

      toast.success('Item listed successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to list item');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">List a New Item</h1>
        <p className="text-gray-600 mt-2">Share your unwanted items with the community</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Item Images</h2>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-4">
            {images.map((image, index) => (
              <div key={index} className="relative aspect-square">
                <img
                  src={image}
                  alt={`Item ${index + 1}`}
                  className="w-full h-full object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={() => handleImageRemove(index)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            
            {images.length < 5 && (
              <button
                type="button"
                onClick={handleImageAdd}
                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary-500 hover:bg-primary-50 transition-colors"
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <span className="text-sm text-gray-600">Add Image</span>
                </div>
              </button>
            )}
          </div>
          
          <p className="text-sm text-gray-500">
            Add up to 5 images. For demo purposes, click "Add Image" to add sample images.
          </p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Item Details</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                required
                value={formData.title}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Vintage Denim Jacket"
              />
            </div>

            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                id="category"
                name="category"
                required
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select category</option>
                <option value="tops">Tops</option>
                <option value="bottoms">Bottoms</option>
                <option value="dresses">Dresses</option>
                <option value="outerwear">Outerwear</option>
                <option value="shoes">Shoes</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>

            <div>
              <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <input
                type="text"
                id="type"
                name="type"
                required
                value={formData.type}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., Jacket, T-shirt, Jeans"
              />
            </div>

            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-2">
                Size *
              </label>
              <select
                id="size"
                name="size"
                required
                value={formData.size}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select size</option>
                <option value="XS">XS</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
                <option value="One Size">One Size</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="condition" className="block text-sm font-medium text-gray-700 mb-2">
                Condition *
              </label>
              <select
                id="condition"
                name="condition"
                required
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="">Select condition</option>
                <option value="new">New - Never worn, with tags</option>
                <option value="like-new">Like New - Worn once or twice, excellent condition</option>
                <option value="good">Good - Some signs of wear, but still in great condition</option>
                <option value="fair">Fair - Noticeable wear, but still functional</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description *
              </label>
              <textarea
                id="description"
                name="description"
                required
                rows={4}
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="Describe your item, including brand, material, fit, and any other relevant details..."
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-2">
                Tags
              </label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                placeholder="e.g., vintage, designer, summer, casual (comma-separated)"
              />
              <p className="text-sm text-gray-500 mt-1">
                Add tags to help others find your item (separate with commas)
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Listing Item...' : 'List Item'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddItem;