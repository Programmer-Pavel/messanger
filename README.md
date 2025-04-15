# Messenger

Это приложение мессенджера, разработанное с использованием React, TypeScript и Vite.

## Локальная разработка

### Предварительные требования

- Node.js (версия 16 или выше)
- npm или yarn

### Настройка окружения

1. Клонируйте репозиторий:

```bash
git clone https://github.com/Programmer-Pavel/messanger.git
cd messanger
```

2. Установите зависимости:

```bash
npm install
```

3. Создайте файл `.env.development` в корне проекта со следующим содержимым:

```
VITE_API_BASE_URL=/api
VITE_SERVER_HOST=YOUR_LOCAL_IP  # Замените на ваш локальный IP-адрес
VITE_SERVER_PORT=5173
VITE_SOCKET_PATH=/socket.io
VITE_API_SERVER=http://YOUR_LOCAL_IP:3000  # Замените на ваш локальный IP-адрес и порт API-сервера
```

4. Запустите проект в режиме разработки:

```bash
npm run dev
```

## Сборка для продакшн

Для сборки проекта для продакшн выполните:

```bash
npm run build
```

Собранные файлы будут находиться в директории `dist`.

## Технологии

- [React](https://reactjs.org/) - библиотека для создания пользовательских интерфейсов
- [TypeScript](https://www.typescriptlang.org/) - типизированный JavaScript
- [Vite](https://vitejs.dev/) - быстрый инструмент сборки
- [Socket.io](https://socket.io/) - для реализации чата и видеозвонков в реальном времени
