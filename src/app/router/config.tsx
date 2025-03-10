import { axiosInstance } from '@shared/lib/axiosConfig';
import { lazy, Suspense } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Lazy loading компонентов
const Chat = lazy(() =>
  import('@features/Chat').then((module) => ({ default: module.Chat })),
);
const Login = lazy(() =>
  import('@pages/login').then((module) => ({ default: module.Login })),
);
const Signup = lazy(() =>
  import('@pages/signup').then((module) => ({ default: module.Signup })),
);
const MainLayout = lazy(() =>
  import('@widgets/layouts').then((module) => ({ default: module.MainLayout })),
);
const AuthLayout = lazy(() =>
  import('@widgets/layouts').then((module) => ({ default: module.AuthLayout })),
);
const NotFound = lazy(() =>
  import('@pages/not-found').then((module) => ({ default: module.NotFound })),
);
const Fitness = lazy(() =>
  import('@pages/fitness').then((module) => ({ default: module.Fitness })),
);

// Компонент загрузки
const LoadingFallback = () => (
  <div className="loading-spinner">Загрузка...</div>
);

// Функция проверки аутентификации
const authLoader = async () => {
  await axiosInstance.get('/auth/check-auth');
};

export const router = createBrowserRouter([
  {
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <MainLayout />
      </Suspense>
    ),
    path: '/',
    loader: authLoader,
    children: [
      {
        path: '/chat',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Chat />
          </Suspense>
        ),
      },
      {
        path: '/fitness',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Fitness />
          </Suspense>
        ),
      },
    ],
  },
  {
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <AuthLayout />
      </Suspense>
    ),
    children: [
      {
        path: '/login',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: '/signup',
        element: (
          <Suspense fallback={<LoadingFallback />}>
            <Signup />
          </Suspense>
        ),
      },
    ],
  },
  {
    path: '*',
    element: (
      <Suspense fallback={<LoadingFallback />}>
        <NotFound />
      </Suspense>
    ),
  },
]);
