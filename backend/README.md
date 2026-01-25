# Backend - Messenger API

Backend приложение на NestJS для мессенджер приложения.

## Технологический стек

- **Framework**: NestJS
- **ORM**: TypeORM
- **Database**: PostgreSQL
- **Authentication**: JWT, Google OAuth2
- **Realtime**: WebSocket (Socket.io)
- **File Storage**: (будет определено)
- **Queue**: (будет определено для уведомлений)

## Структура модулей

### AuthModule
Аутентификация и авторизация пользователей.

**Controllers:**
- `AuthController` - endpoints для регистрации, логина, refresh токенов, Google OAuth2

**Providers:**
- `AuthService` - бизнес-логика аутентификации
- `JwtStrategy` - JWT стратегия для Passport
- `GoogleStrategy` - Google OAuth2 стратегия для Passport
- `TokenService` - генерация и валидация JWT токенов
- `SessionService` - управление сессиями пользователей

**Modules:**
- `AuthModule` - основной модуль аутентификации

### UsersModule
Управление профилями пользователей.

**Controllers:**
- `UsersController` - CRUD операции с профилями, получение аватаров, настройки

**Providers:**
- `UsersService` - бизнес-логика работы с пользователями
- `ProfileService` - управление профилями
- `AvatarService` - загрузка и обработка аватаров
- `SettingsService` - управление настройками пользователя

**Modules:**
- `UsersModule` - основной модуль пользователей

### ChatsModule
Управление чатами (1-1 и групповые).

**Controllers:**
- `ChatsController` - создание чатов, получение списка, управление участниками, ролями

**Providers:**
- `ChatsService` - бизнес-логика работы с чатами
- `ChatMembersService` - управление участниками чатов
- `ChatRolesService` - управление ролями (owner/admin/member)
- `ChatPermissionsService` - проверка прав доступа

**Modules:**
- `ChatsModule` - основной модуль чатов

### MessagesModule
Сообщения и их статусы доставки.

**Controllers:**
- `MessagesController` - отправка сообщений, получение истории, поиск, обновление статусов

**Providers:**
- `MessagesService` - бизнес-логика работы с сообщениями
- `MessageStatusService` - управление статусами (sent/delivered/read)
- `MessageSearchService` - поиск по сообщениям и диалогам
- `MessageHistoryService` - пагинация истории сообщений

**Modules:**
- `MessagesModule` - основной модуль сообщений

### RealtimeModule
WebSocket gateway для real-time коммуникации.

**Controllers:**
- `RealtimeGateway` - WebSocket gateway для обработки событий

**Providers:**
- `RealtimeService` - бизнес-логика real-time коммуникации
- `PresenceService` - управление статусами присутствия (online/offline)
- `TypingService` - обработка typing indicators
- `EventEmitter` - эмиссия событий для других модулей

**Modules:**
- `RealtimeModule` - основной модуль real-time

### FilesModule
Загрузка и управление файлами.

**Controllers:**
- `FilesController` - загрузка файлов, получение файлов, управление доступом

**Providers:**
- `FilesService` - бизнес-логика работы с файлами
- `FileStorageService` - сохранение файлов (локально/S3/etc)
- `FileAccessService` - управление правами доступа к файлам
- `FileValidationService` - валидация типов и размеров файлов

**Modules:**
- `FilesModule` - основной модуль файлов

### NotificationsModule
Система уведомлений через очередь.

**Controllers:**
- `NotificationsController` - получение уведомлений, настройки уведомлений

**Providers:**
- `NotificationsService` - бизнес-логика уведомлений
- `NotificationQueueService` - очередь уведомлений
- `NotificationDeliveryService` - доставка уведомлений (email/push/etc)
- `NotificationPreferencesService` - настройки уведомлений пользователей

**Modules:**
- `NotificationsModule` - основной модуль уведомлений

### ModerationModule
Модерация контента, блоки, репорты.

**Controllers:**
- `ModerationController` - создание репортов, блокировка пользователей, модерация контента

**Providers:**
- `ModerationService` - бизнес-логика модерации
- `BlockService` - управление блокировками пользователей
- `ReportService` - обработка репортов
- `RateLimitService` - лимиты на действия пользователей

**Modules:**
- `ModerationModule` - основной модуль модерации

### ObservabilityModule
Мониторинг, логирование, метрики, healthchecks.

**Controllers:**
- `HealthController` - healthcheck endpoints

**Providers:**
- `LoggerService` - централизованное логирование
- `MetricsService` - сбор метрик приложения
- `TracingService` - трейсинг запросов
- `HealthService` - проверка здоровья сервисов (DB, Redis, etc)

**Modules:**
- `ObservabilityModule` - основной модуль мониторинга

## Структура проекта

```
backend/
├── src/
│   ├── auth/              # AuthModule
│   ├── users/             # UsersModule
│   ├── chats/             # ChatsModule
│   ├── messages/          # MessagesModule
│   ├── realtime/          # RealtimeModule
│   ├── files/             # FilesModule
│   ├── notifications/     # NotificationsModule
│   ├── moderation/        # ModerationModule
│   ├── observability/     # ObservabilityModule
│   ├── common/            # Общие утилиты, декораторы, guards
│   └── main.ts            # Точка входа
├── test/                  # Тесты
├── package.json
└── README.md
```

## Установка и запуск

```bash
npm install
# Запуск БД и Redis (Docker):
docker compose -f docker-compose.dev.yml up -d
cp .env.example .env   # отредактируй при необходимости
npm run start:dev
```

## Проверка работы backend

После запуска backend доступен на `http://localhost:3000` (или порт из `.env`).

### Базовый ping

```bash
curl http://localhost:3000/
```

Ожидаемый ответ:
```json
{"ok":true,"service":"messenger-api"}
```

### Healthcheck endpoints

**Общий healthcheck** (проверка БД, памяти):
```bash
curl http://localhost:3000/health
```

**Liveness probe** (проверка, что приложение запущено):
```bash
curl http://localhost:3000/health/live
```

**Readiness probe** (проверка готовности принимать запросы):
```bash
curl http://localhost:3000/health/ready
```

**Проверка подключения к БД**:
```bash
curl http://localhost:3000/health/db
```

Ожидаемый ответ при успешной проверке:
```json
{
  "status": "ok",
  "info": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "memory_rss": { "status": "up" }
  },
  "error": {},
  "details": {
    "database": { "status": "up" },
    "memory_heap": { "status": "up" },
    "memory_rss": { "status": "up" }
  }
}
```

### Проверка подключения к БД напрямую

```bash
# Проверка через psql (если установлен)
psql -h localhost -U postgres -d messenger -c "SELECT 1;"

# Или через Docker
docker exec -it messenger-postgres-1 psql -U postgres -d messenger -c "SELECT 1;"
```

### Проверка Redis

```bash
# Через redis-cli (если установлен)
redis-cli -h localhost -p 6379 ping

# Или через Docker
docker exec -it messenger-redis-1 redis-cli ping
```

Ожидаемый ответ: `PONG`

## Docker

- **Разработка** (только БД + Redis): `docker compose -f docker-compose.dev.yml up -d`
- **Полный стек**: `docker compose up -d` — приложение + Postgres + Redis

## Переменные окружения

Создайте файл `.env` в корне backend:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/messenger
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
PORT=3000
```
