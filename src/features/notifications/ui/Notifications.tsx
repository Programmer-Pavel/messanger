import { useEffect, useState } from 'react';
import { useAuthenticatedSocket } from '@features/socket';
import { MessageNotification, useNotificationsStore } from '../model/notificationsStore';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useClickOutside } from '@shared/hooks/useClickOutside';
import { formatRelativeTime } from '@shared/lib/formatDate';
import React from 'react';
import { Button } from '@shared/ui/Button';
import { IconButton } from '@shared/ui/IconButton';
import { cn } from '@/shared/lib/utils';

export const Notifications = () => {
  const [isOpen, setIsOpen] = useState(false);

  const { notifications, clearNotifications, addNotification, removeNotification } = useNotificationsStore();

  const socket = useAuthenticatedSocket();

  const dropdownRef = useClickOutside<HTMLDivElement>(() => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (!socket) return;

    // Обработчик уведомлений о новых сообщениях
    const handleNewMessageNotification = (notification: MessageNotification) => {
      addNotification(notification);
    };

    socket.on('newMessageNotification', handleNewMessageNotification);

    return () => {
      socket.off('newMessageNotification', handleNewMessageNotification);
    };
  }, [socket, addNotification]);

  const hasUnreadNotifications = notifications.length > 0;

  const toggleNotifications = () => {
    setIsOpen((prev) => !prev);
  };

  const handleClearAll = () => {
    clearNotifications();
    setIsOpen(false);
  };

  const handleNotificationClick = (notification: MessageNotification) => {
    removeNotification(notification);
  };

  const handleRemoveNotification =
    (notification: MessageNotification) =>
    (e: React.MouseEvent<HTMLButtonElement>): void => {
      e.stopPropagation();
      removeNotification(notification);
    };

  const getNotificationItemClasses = (index: number, total: number): string => {
    return cn('p-3 hover:bg-indigo-50 cursor-pointer transition-colors duration-200 group', {
      'border-b': index !== total - 1,
    });
  };

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <IconButton
        icon={BellIcon}
        onClick={toggleNotifications}
        variant="primary"
        size="sm"
        aria-label="Уведомления"
      >
        {hasUnreadNotifications && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white w-5 h-5 rounded-full text-xs flex items-center justify-center font-medium shadow-sm animate-pulse">
            {notifications.length > 9 ? '9+' : notifications.length}
          </span>
        )}
      </IconButton>

      {/* Выпадающий список уведомлений */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50 overflow-hidden transform transition-all duration-200 origin-top-right">
          <div className="p-3 border-b bg-gradient-to-r from-indigo-50 to-indigo-100 flex justify-between items-center">
            <h3 className="font-semibold text-indigo-800">
              Уведомления {hasUnreadNotifications && <span className="text-xs">({notifications.length})</span>}
            </h3>
            {notifications.length > 0 && (
              <Button
                onClick={handleClearAll}
                variant="secondary"
                className="text-xs bg-transparent text-indigo-600 hover:text-indigo-800 hover:bg-indigo-200 px-2 py-1"
              >
                Очистить все
              </Button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length > 0 ? (
              <div>
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className={getNotificationItemClasses(index, notifications.length)}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-indigo-700">Новое сообщение</p>
                          <span className="text-xs text-gray-500 ml-2 group-hover:text-indigo-600">
                            {formatRelativeTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{notification.messagePreview}</p>
                      </div>
                    </div>
                    <div className="mt-1 flex justify-end">
                      <IconButton
                        icon={XMarkIcon}
                        onClick={handleRemoveNotification(notification)}
                        variant="secondary"
                        size="sm"
                        title="Удалить уведомление"
                      />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center">
                <div className="text-indigo-300 mb-2">
                  <BellIcon className="h-12 w-12 mx-auto" />
                </div>
                <p className="text-gray-500">Нет новых уведомлений</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
