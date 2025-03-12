import { LoadingFallback } from '@shared/ui/LoadingFallback';
import { LoadingIndicator } from '@shared/ui/LoadingIndicator';
import { Suspense } from 'react';
import { createBrowserRouter } from 'react-router';
import {
  Chat,
  Login,
  Signup,
  MainLayout,
  AuthLayout,
  NotFound,
  Fitness,
} from './lazyComponents';
import { authCheck } from '@features/auth';
import { ROUTES } from '@shared/config/routes';

// Функция для обертывания компонентов в Suspense
const withSuspense = (Component: React.ComponentType) => (
  <Suspense fallback={<LoadingFallback />}>
    <Component />
  </Suspense>
);

// Функция для создания корневого компонента с индикатором загрузки
const withRootLayout = (Component: React.ComponentType) => (
  <>
    <LoadingIndicator />
    {withSuspense(Component)}
  </>
);

export const router = createBrowserRouter([
  {
    element: withRootLayout(MainLayout),
    path: ROUTES.ROOT,
    loader: authCheck,
    children: [
      {
        path: ROUTES.CHAT,
        element: withSuspense(Chat),
      },
      {
        path: ROUTES.FITNESS,
        element: withSuspense(Fitness),
      },
    ],
  },
  {
    element: withRootLayout(AuthLayout),
    children: [
      {
        path: ROUTES.LOGIN,
        element: withSuspense(Login),
      },
      {
        path: ROUTES.SIGNUP,
        element: withSuspense(Signup),
      },
    ],
  },
  {
    path: ROUTES.NOT_FOUND,
    element: withRootLayout(NotFound),
  },
]);
