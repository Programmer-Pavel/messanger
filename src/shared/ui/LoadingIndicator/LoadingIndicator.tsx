import { useNavigation } from 'react-router';
import { LoadingFallback } from '../LoadingFallback';

export const LoadingIndicator = () => {
  const navigation = useNavigation();

  if (navigation.state === 'loading') {
    return (
      <div className="fixed top-0 left-0 right-0 bottom-0 bg-white bg-opacity-70 flex justify-center items-center z-[1000]">
        <LoadingFallback />
      </div>
    );
  }

  return null;
};
