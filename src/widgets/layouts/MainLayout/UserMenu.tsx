import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useClickOutside } from '@shared/hooks/useClickOutside';
import { axiosInstance } from '@shared/lib/axiosConfig';

export const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [userData] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const navigate = useNavigate();

  const menuRef = useClickOutside<HTMLDivElement>(() => {
    setIsMenuOpen(false);
  });

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = async () => {
    await axiosInstance.post('/auth/logout');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer"
        onClick={toggleMenu}
      >
        <img
          className="h-8 w-8 rounded-full"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Аватар пользователя"
        />
        <span>{userData?.name}</span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg focus:outline-none z-10">
          <Link
            to="/profile"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Профиль
          </Link>
          <Link
            to="/settings"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Настройки
          </Link>
          <button
            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer"
            onClick={logout}
          >
            Выйти
          </button>
        </div>
      )}
    </div>
  );
};
