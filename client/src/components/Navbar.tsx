import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Shirt, User, LogOut, Settings } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-lg border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Shirt className="h-8 w-8 text-primary-600" />
              <span className="text-2xl font-bold text-gray-900">ReWear</span>
            </Link>
            <div className="hidden md:flex ml-10 space-x-8">
              <Link to="/browse" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Browse Items
              </Link>
              {user && (
                <Link to="/add-item" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  List Item
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Points:</span>
                  <span className="bg-primary-100 text-primary-800 px-2 py-1 rounded-full text-sm font-medium">
                    {user.points}
                  </span>
                </div>
                <div className="relative group">
                  <button className="flex items-center space-x-2 text-gray-600 hover:text-primary-600">
                    <User className="h-5 w-5" />
                    <span className="hidden md:block">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link to="/dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                    {user.role === 'admin' && (
                      <Link to="/admin" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-600 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                  Login
                </Link>
                <Link to="/register" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;