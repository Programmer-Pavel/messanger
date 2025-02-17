import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { RouterProvider } from 'react-router-dom';
import { router } from './router/config';
import { getPlatform } from '@shared/lib/platform';

const queryClient = new QueryClient();

function App() {
  const platform = getPlatform()

  console.log('platform', platform)
  
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
