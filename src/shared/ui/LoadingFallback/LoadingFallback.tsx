import { Spinner } from '../Spinner';

export const LoadingFallback = () => (
  <div className="flex items-center justify-center h-screen">
    <Spinner size={4} className="text-blue-600" />
  </div>
);
