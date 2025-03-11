import React, { useState, useEffect } from 'react';

// Определение типа для отложенного события установки PWA
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState<boolean>(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Предотвращаем автоматическое появление мини-инфобара на мобильных устройствах
      e.preventDefault();
      // Сохраняем событие для последующего использования
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Показываем кнопку установки
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      // Скрываем предложение установки
      setShowPrompt(false);
      // Очищаем отложенное событие установки
      setDeferredPrompt(null);
      // Логируем событие установки
      console.log('PWA было установлено');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Очистка обработчиков событий при размонтировании компонента
    return () => {
      window.removeEventListener(
        'beforeinstallprompt',
        handleBeforeInstallPrompt,
      );
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = () => {
    if (!deferredPrompt) return;

    // Показываем промпт установки
    deferredPrompt.prompt();

    // Ожидаем выбор пользователя
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('Пользователь принял предложение установки');
      } else {
        console.log('Пользователь отклонил предложение установки');
      }
      // Сбрасываем отложенное событие, так как оно может быть использовано только один раз
      setDeferredPrompt(null);
    });

    setShowPrompt(false);
  };

  // Если не нужно показывать промпт, возвращаем null
  if (!showPrompt) return null;

  return (
    <div className="fixed bottom-4 left-0 right-0 mx-auto max-w-md p-4 bg-white shadow-lg rounded-lg border border-gray-200 z-50">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">
          Установите это приложение на ваше устройство для лучшего опыта!
        </p>
        <button
          onClick={handleInstallClick}
          className="ml-3 inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          Установить
        </button>
      </div>
    </div>
  );
};
