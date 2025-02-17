import { Chat } from '@features/Chat';
import { Login } from '@pages/login';
import { Signup } from '@pages/signup';
import { AuthLayout, MainLayout } from '@widgets/layouts';
import { createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter([
  {
    element: <MainLayout />,
    path: '/',
    children: [
      {
        path: '/chat',
        element: <Chat />,
      },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: '/signup',
        element: <Signup />,
      },
    ],
  },
]);
