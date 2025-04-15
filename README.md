# React + TypeScript + Vite Messenger

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
VITE_USE_HTTPS=false  # Установите true, если хотите использовать HTTPS
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

## Расширение конфигурации ESLint

Если вы разрабатываете приложение для продакшн, рекомендуем обновить конфигурацию для включения проверки типов:

- Настройте свойство `parserOptions` верхнего уровня следующим образом:

```js
export default tseslint.config({
  languageOptions: {
    // другие опции...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

- Замените `tseslint.configs.recommended` на `tseslint.configs.recommendedTypeChecked` или `tseslint.configs.strictTypeChecked`
- При желании добавьте `...tseslint.configs.stylisticTypeChecked`
- Установите [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) и обновите конфигурацию:

```js
// eslint.config.js
import react from 'eslint-plugin-react';

export default tseslint.config({
  // Установите версию react
  settings: { react: { version: '18.3' } },
  plugins: {
    // Добавьте плагин react
    react,
  },
  rules: {
    // другие правила...
    // Включите рекомендуемые правила
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
});
```
