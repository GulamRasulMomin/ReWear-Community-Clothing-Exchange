import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, RefreshCw, Users, Award, ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

interface FeaturedItem {
  _id: string;
  title: string;
  images: string[];
  category: string;
  condition: string;
}

const Landing = () => {
  const [featuredItems, setFeaturedItems] = useState<FeaturedItem[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    fetchFeaturedItems();
  }, []);

  const fetchFeaturedItems = async () => {
    try {
      const response = await axios.get('/api/items?limit=6&featured=true');
      setFeaturedItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching featured items:', error);
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, featuredItems.length - 2));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + Math.max(1, featuredItems.length - 2)) % Math.max(1, featuredItems.length - 2));
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Sustainable Fashion
              <span className="block text-primary-200">Starts Here</span>
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-primary-100 max-w-3xl mx-auto">
              Join our community-driven platform to exchange, swap, and redeem pre-loved clothing. 
              Reduce waste, refresh your wardrobe, and earn points with every contribution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register"
                className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center justify-center"
              >
                Start Swapping
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link
                to="/browse"
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
              >
                Browse Items
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How ReWear Works</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our platform makes sustainable fashion accessible through three simple ways to participate
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <RefreshCw className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Direct Swaps</h3>
              <p className="text-gray-600">
                Exchange your items directly with other community members. Find perfect matches and swap instantly.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Point System</h3>
              <p className="text-gray-600">
                Earn points by listing quality items. Use points to redeem items from our community marketplace.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-primary-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Community Driven</h3>
              <p className="text-gray-600">
                Join thousands of fashion enthusiasts committed to reducing textile waste and promoting sustainability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Items Carousel */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Items</h2>
            <p className="text-xl text-gray-600">Discover amazing pieces from our community</p>
          </div>
          
          {featuredItems.length > 0 ? (
            <div className="relative">
              <div className="overflow-hidden">
                <div 
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
                >
                  {featuredItems.map((item) => (
                    <div key={item._id} className="w-1/3 flex-shrink-0 px-4">
                      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <img
                          src={item.images[0] || '/placeholder-image.jpg'}
                          alt={item.title}
                          className="w-full h-64 object-cover"
                        />
                        <div className="p-6">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">{item.title}</h3>
                          <div className="flex justify-between text-sm text-gray-600">
                            <span className="bg-gray-100 px-2 py-1 rounded">{item.category}</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">{item.condition}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {featuredItems.length > 3 && (
                <>
                  <button
                    onClick={prevSlide}
                    className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-600" />
                  </button>
                  <button
                    onClick={nextSlide}
                    className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-gray-50"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-600" />
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-600">
              <p>No featured items available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Transform Your Wardrobe?</h2>
          <p className="text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
            Join thousands of fashion-conscious individuals making a positive impact on the environment
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/register"
              className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Join the Community
            </Link>
            <Link
              to="/add-item"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors"
            >
              List Your First Item
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;