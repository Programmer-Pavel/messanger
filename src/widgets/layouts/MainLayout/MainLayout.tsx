import { Outlet } from 'react-router';
import { Header } from './Header';

export function MainLayout() {
  return (
    <div className="w-full h-full bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 w-full p-5 overflow-auto scrollbar-gutter-stable">
        <Outlet />
      </main>

      <footer className="bg-white mt-auto">{/* Footer content */}</footer>
    </div>
  );
}
