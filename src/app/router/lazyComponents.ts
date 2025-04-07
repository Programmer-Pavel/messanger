import { lazy } from 'react';

// Компоненты фич
export const Chat = lazy(() => import('@pages/chat').then((module) => ({ default: module.Chat })));

// Компоненты страниц
export const Login = lazy(() => import('@pages/login').then((module) => ({ default: module.Login })));

export const Signup = lazy(() => import('@pages/signup').then((module) => ({ default: module.Signup })));

export const NotFound = lazy(() => import('@pages/not-found').then((module) => ({ default: module.NotFound })));

export const Fitness = lazy(() => import('@pages/fitness').then((module) => ({ default: module.Fitness })));

export const TestPage = lazy(() => import('@pages/3d-test-page').then((module) => ({ default: module.TestPage })));

// Компоненты лейаутов
export const MainLayout = lazy(() => import('@widgets/layouts').then((module) => ({ default: module.MainLayout })));

export const AuthLayout = lazy(() => import('@widgets/layouts').then((module) => ({ default: module.AuthLayout })));
