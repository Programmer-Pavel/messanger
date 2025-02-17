import { useState } from 'react';
import { Link } from 'react-router-dom';

export const Header = () => {
  const [userData] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-8">
            <Link to="/" className="text-2xl font-bold text-indigo-600">
              Logo
            </Link>
            <nav className="hidden md:flex space-x-8">
              <Link to="/" className="text-gray-900 hover:text-indigo-600">
                Dashboard
              </Link>
              <Link to="/" className="text-gray-900 hover:text-indigo-600">
                Projects
              </Link>
              <Link to="/" className="text-gray-900 hover:text-indigo-600">
                Team
              </Link>
              <Link to="/login" className="text-gray-900 hover:text-indigo-600">
                Login
              </Link>
              <Link to="/chat" className="text-gray-900 hover:text-indigo-600">
                Chat
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <button className="text-gray-500 hover:text-gray-700">
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
            </button>

            <div className="relative">
              <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
                <img
                  className="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt="User avatar"
                />
                <span>{userData?.name}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
