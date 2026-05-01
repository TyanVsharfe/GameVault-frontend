# GameVault Frontend

Frontend-приложение для GameVault: личной игровой библиотеки с поиском игр, профилем пользователя, коллекциями, списками, достижениями и интеграциями с внешними игровыми данными.

Проект построен на React, TypeScript и Vite. Интерфейс использует MUI Joy, Redux Toolkit, React Router, axios и набор UI-библиотек для карточек, списков, графиков и интерактивных элементов.

## Содержание

- [Возможности](#возможности)
- [Технологии](#технологии)
- [Требования](#требования)
- [Быстрый старт](#быстрый-старт)
- [Переменные окружения](#переменные-окружения)
- [Скрипты](#скрипты)
- [Структура проекта](#структура-проекта)
- [API](#api)
- [Маршруты приложения](#маршруты-приложения)
- [Сборка](#сборка)

## Возможности

- Поиск и просмотр игр.
- Страницы игр, серий и игровых компаний.
- Регистрация, вход, подтверждение email и восстановление пароля.
- Защищенный личный кабинет пользователя.
- Управление пользовательской библиотекой игр.
- Пользовательские списки и коллекции игр.
- Достижения, заметки, статусы и статистика.
- Локализация интерфейса на русском и английском языках.

## Технологии

- [React 18](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vite.dev/)
- [React Router](https://reactrouter.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [React Query](https://tanstack.com/query/v3/)
- [SWR](https://swr.vercel.app/)
- [axios](https://axios-http.com/)
- [MUI Joy](https://mui.com/joy-ui/getting-started/)
- [Recharts](https://recharts.org/)
- [Swiper](https://swiperjs.com/)
- [dnd kit](https://dndkit.com/)
- [i18next](https://www.i18next.com/)

## Требования

- Node.js 18 или новее.
- npm 9 или новее.
- Запущенный backend GameVault API. По умолчанию frontend ожидает API на `http://localhost:8080`.

## Быстрый старт

```bash
git clone <repository-url>
cd GameVault-frontend
npm install
npm run dev
```

После запуска приложение будет доступно по адресу:

```text
http://localhost:3000
```

## Переменные окружения

Frontend читает адрес backend API из переменной `VITE_API_URL`.

Создайте файл `.env.local` в корне проекта, если backend запущен не на стандартном адресе:

```env
VITE_API_URL=http://localhost:8080
```

Итоговый base URL собирается так:

```text
VITE_API_URL + /api/v1
```

Если `VITE_API_URL` не задан, используется значение по умолчанию:

```text
http://localhost:8080/api/v1
```

## Скрипты

```bash
npm run dev
```

Запускает Vite dev server на порту `3000`.

```bash
npm run build
```

Собирает production-версию приложения в папку `dist`.

```bash
npm run preview
```

Запускает локальный preview production-сборки.

## Структура проекта

```text
src/
  api/              axios-клиенты, interceptors и сервисы API
  assets/           иконки, изображения и глобальные стили
  components/       переиспользуемые UI-компоненты
  config/           конфигурация приложения
  i18n/             локализация и словари
  pages/            страницы приложения
  store/            Redux store, slices и работа с localStorage
  types/            TypeScript-типы доменной модели
  utils/            общие утилиты и enum-значения
```

Ключевые файлы:

- `src/main.tsx` - точка входа приложения.
- `src/App.tsx` - маршруты и базовая композиция приложения.
- `src/config/api.config.ts` - конфигурация backend API.
- `src/api/client.ts` - axios-клиенты для JSON API и IGDB-запросов.
- `vite.config.ts` - конфигурация Vite, React и SVGR.

## API

Приложение использует два axios-клиента:

- `apiClient` - основной JSON-клиент с `withCredentials: true`.
- `igdbClient` - клиент для текстовых IGDB-запросов с `Accept: application/json`.

Сервисы API находятся в `src/api/services`:

- `authService.ts`
- `igdbGamesService.ts`
- `enrichedGamesService.ts`
- `steamGamesService.ts`
- `userGamesService.ts`
- `userGameListService.ts`
- `userProfileService.ts`
- `userStatsService.ts`
- `achievementService.ts`
- `noteService.ts`

## Маршруты приложения

Публичные маршруты:

- `/main` - главная страница.
- `/search` - поиск игр.
- `/login` - вход.
- `/registration` - регистрация.
- `/registration/verify` - подтверждение email.
- `/reset-password` - восстановление пароля.
- `/reset-password/verify` - подтверждение восстановления пароля.
- `/games/:id` - страница игры.
- `/series/:series` - страница серии.
- `/company/:company` - страница компании.

Защищенные маршруты:

- `/account` - профиль пользователя.
- `/account/games` - библиотека игр пользователя.
- `/account/lists` - коллекции пользователя.
- `/account/lists/:id` - отдельная коллекция.
- `/account/settings` - настройки аккаунта.
- `/account/achievements` - достижения пользователя.

## Сборка

Для production-сборки выполните:

```bash
npm run build
```

Для локальной проверки собранного приложения:

```bash
npm run preview
```



