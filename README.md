# Messenger Application

Монорепозиторий для мессенджер приложения с разделением на frontend и backend.

## Функциональные требования

### Аутентификация и авторизация
- Регистрация/логин пользователей
- JWT токены для авторизации
- Google OAuth2 интеграция

### Диалоги
- Список диалогов (1-1 и групповые чаты)
- Создание и управление чатами
- Роли участников (owner/admin/member)

### Сообщения
- Отправка и получение сообщений в реальном времени
- Статусы доставки: delivered/read (минимум delivered)
- История сообщений с пагинацией
- Поиск по диалогам (по названию/участникам)
- Typing indicator (индикатор набора текста)

### Присутствие
- Статусы пользователей: online/offline

## Структура проекта

```
messenger/
├── frontend/          # Next.js приложение
├── backend/           # NestJS API
└── README.md          # Этот файл
```

## Технологический стек

### Backend
- **Framework**: NestJS
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Auth**: JWT, Google OAuth2
- **Realtime**: WebSocket

### Frontend
- **Framework**: Next.js
- **UI Library**: React
- **State Management**: (будет определено)
- **Realtime**: WebSocket client

## План разработки

### Этап 1: Настройка инфраструктуры
- [x] Создание структуры монорепо
- [x] Инициализация backend (NestJS)
- [x] Инициализация frontend (Next.js)
- [ ] Настройка базы данных (PostgreSQL)
- [ ] Настройка Docker для разработки

### Этап 2: Backend - Базовая функциональность
- [ ] AuthModule: регистрация, логин, JWT, Google OAuth2
- [ ] UsersModule: профили, аватары, настройки
- [ ] ChatsModule: создание чатов, участники, роли
- [ ] MessagesModule: отправка/получение сообщений, статусы
- [ ] RealtimeModule: WebSocket gateway для real-time коммуникации

### Этап 3: Backend - Дополнительная функциональность
- [ ] FilesModule: загрузка файлов и вложений
- [ ] NotificationsModule: система уведомлений
- [ ] ModerationModule: модерация, блоки, репорты
- [ ] ObservabilityModule: логирование, метрики, healthchecks

### Этап 4: Frontend - Базовые страницы
- [ ] Страница логина/регистрации
- [ ] Главная страница со списком диалогов
- [ ] Страница чата
- [ ] Профиль пользователя

### Этап 5: Frontend - Интеграция
- [ ] Интеграция с backend API
- [ ] WebSocket подключение для real-time
- [ ] Управление состоянием приложения
- [ ] Обработка ошибок

### Этап 6: Тестирование и оптимизация
- [ ] Unit тесты
- [ ] E2E тесты
- [ ] Оптимизация производительности
- [ ] Документация API

## Модули Backend

1. **AuthModule** - Аутентификация и авторизация
2. **UsersModule** - Управление пользователями
3. **ChatsModule** - Управление чатами
4. **MessagesModule** - Сообщения и их статусы
5. **RealtimeModule** - WebSocket для real-time коммуникации
6. **FilesModule** - Работа с файлами
7. **NotificationsModule** - Система уведомлений
8. **ModerationModule** - Модерация контента
9. **ObservabilityModule** - Мониторинг и логирование

Подробное описание каждого модуля находится в `backend/README.md` и в README каждого модуля.

## Запуск проекта

### Backend
```bash
cd backend
npm install
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Лицензия

MIT
