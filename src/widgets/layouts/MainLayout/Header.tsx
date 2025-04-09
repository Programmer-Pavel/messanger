import { Link, useLocation } from 'react-router';
import { UserMenu } from './UserMenu';
import cn from 'classnames';
import { useState } from 'react';
import { ROUTES } from '@shared/config/routes';

export const Header = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Chat', to: ROUTES.CHAT },
    { name: 'Fitness', to: ROUTES.FITNESS },
    { name: 'Test', to: ROUTES.TEST_PAGE },
  ];

  const getNavItemClasses = (path: string) => {
    const isActive = location.pathname === path;

    return cn(
      {
        'bg-gray-900 text-white': isActive,
        'text-gray-300 hover:bg-gray-700 hover:text-white': !isActive,
      },
      'rounded-md px-3 py-2 text-sm font-medium',
    );
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const mobileMenuClasses = cn(
    {
      block: isMenuOpen,
      hidden: !isMenuOpen,
    },
    'md:hidden',
  );

  const getMobileNavItemClasses = (path: string) => {
    const isActive = location.pathname === path;

    return cn(
      {
        'bg-gray-900 text-white': isActive,
        'text-gray-300 hover:bg-gray-700 hover:text-white': !isActive,
      },
      'block rounded-md px-3 py-2 text-base font-medium',
    );
  };

  return (
    <header className="sticky top-0 z-10 bg-gray-800 shadow">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center gap-8">
            <Link
              to={ROUTES.ROOT}
              className="text-2xl font-bold text-indigo-600"
            >
              Logo
            </Link>

            {/* Десктопная навигация */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-center gap-x-6"
                >
                  <Link
                    to={item.to}
                    className={getNavItemClasses(item.to)}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {/* Кнопка уведомлений */}
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

            <UserMenu />

            {/* Бургер-кнопка для мобильного меню */}
            <button
              type="button"
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              aria-controls="mobile-menu"
              aria-expanded="false"
              onClick={toggleMenu}
            >
              <span className="sr-only">Открыть главное меню</span>
              {/* Иконка бургера (меняется когда меню открыто) */}
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Мобильное меню */}
      <div
        className={mobileMenuClasses}
        id="mobile-menu"
      >
        <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.to}
              className={getMobileNavItemClasses(item.to)}
              onClick={() => setIsMenuOpen(false)} // Закрывать меню при переходе
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
};
