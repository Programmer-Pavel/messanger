import { Spinner } from '../Spinner';

export const LoadingFallback = () => (
  <div className="flex items-center justify-center h-full">
    <Spinner size={4} />
  </div>
);
