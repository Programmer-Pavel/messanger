import { Button } from '@shared/ui/Button';

export const ErrorBoundaryContent = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="text-center max-w-md">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Что-то пошло не так</h2>
        <p className="text-gray-600 mb-6">Произошла ошибка при загрузке страницы. Пожалуйста, попробуйте снова.</p>

        <div className="flex items-center justify-center">
          <Button
            type="button"
            onClick={() => window.location.reload()}
          >
            Обновить страницу
          </Button>
        </div>
      </div>
    </div>
  );
};
