import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useClickOutside } from '@shared/hooks/useClickOutside';
import { ROUTES } from '@shared/config/routes';
import { useLogoutMutation, useUserStore } from '@features/auth';

export const UserMenu = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const user = useUserStore((state) => state.user);

  const navigate = useNavigate();

  const menuRef = useClickOutside<HTMLDivElement>(() => {
    setIsMenuOpen(false);
  });

  const { mutate } = useLogoutMutation();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const logout = async () => {
    mutate(
      {},
      {
        onSuccess: () => {
          localStorage.removeItem('user');
          navigate(ROUTES.LOGIN);
        },
      },
    );
  };

  return (
    <div
      className="relative"
      ref={menuRef}
    >
      <button
        className="flex items-center gap-2 text-gray-300 hover:text-white cursor-pointer"
        onClick={toggleMenu}
      >
        <img
          className="h-8 w-8 rounded-full"
          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
          alt="Аватар пользователя"
        />
        <span>{user?.name}</span>
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
