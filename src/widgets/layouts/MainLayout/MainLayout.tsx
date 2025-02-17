import { Outlet } from 'react-router-dom';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="w-full h-full bg-gray-50">
      <Header />

      <main className="h-[calc(100vh-64px)] flex items-center justify-center mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>

      <footer className="bg-white mt-auto">{/* Footer content */}</footer>
    </div>
  );
}
