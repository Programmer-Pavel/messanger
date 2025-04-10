import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router/dom';
import { router } from './router/config';
import { InstallPrompt } from '@widgets/pwa';
import { queryClient } from '@shared/lib/queryClient';
import { ErrorBoundary } from '@shared/ui/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <InstallPrompt />
        <RouterProvider router={router} />
        <Toaster />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
