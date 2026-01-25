# ModerationModule

Модуль модерации контента, блокировок и репортов.

## Описание

Обеспечивает модерацию контента, блокировку пользователей, обработку репортов, лимиты на действия пользователей.

## Структура модуля

### Controllers

**ModerationController**
- `POST /moderation/reports` - создание репорта
- `GET /moderation/reports` - получение списка репортов (для модераторов)
- `PATCH /moderation/reports/:id` - обработка репорта
- `POST /moderation/blocks` - блокировка пользователя
- `DELETE /moderation/blocks/:id` - разблокировка пользователя
- `GET /moderation/blocks` - получение списка блокировок
- `POST /moderation/content/check` - проверка контента на модерацию

### Providers

**ModerationService**
- `createReport()` - создание репорта
- `processReport()` - обработка репорта
- `getReports()` - получение списка репортов
- `moderateContent()` - модерация контента

**BlockService**
- `blockUser()` - блокировка пользователя
- `unblockUser()` - разблокировка пользователя
- `isBlocked()` - проверка блокировки
- `getBlockedUsers()` - получение списка заблокированных
- `getBlockedByUsers()` - получение списка тех, кто заблокировал пользователя

**ReportService**
- `createReport()` - создание репорта
- `getReport()` - получение репорта
- `updateReportStatus()` - обновление статуса репорта
- `getUserReports()` - получение репортов пользователя
- `resolveReport()` - разрешение репорта

**RateLimitService**
- `checkRateLimit()` - проверка лимита
- `incrementCounter()` - увеличение счетчика
- `resetCounter()` - сброс счетчика
- `getRemainingAttempts()` - получение оставшихся попыток

### Modules

**ModerationModule**
- Импортирует UsersModule для работы с пользователями
- Импортирует MessagesModule для модерации сообщений
- Импортирует ChatsModule для модерации чатов

## Типы репортов

- Спам
- Оскорбления
- Неподходящий контент
- Мошенничество
- Другое

## Статусы репортов

- **pending** - ожидает обработки
- **reviewing** - на рассмотрении
- **resolved** - разрешен
- **rejected** - отклонен

## Лимиты

- Количество сообщений в минуту
- Количество запросов API
- Размер загружаемых файлов
- Количество участников в чате

## Зависимости

- `UsersModule` - для работы с пользователями
- `MessagesModule` - для модерации сообщений
- `ChatsModule` - для модерации чатов
- Redis (для rate limiting)
