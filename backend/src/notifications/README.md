# NotificationsModule

Модуль системы уведомлений через очередь.

## Описание

Обеспечивает отправку уведомлений пользователям через различные каналы (push, email, in-app), управление очередью уведомлений, настройки уведомлений пользователей.

## Структура модуля

### Controllers

**NotificationsController**
- `GET /notifications` - получение уведомлений пользователя
- `GET /notifications/:id` - получение конкретного уведомления
- `PATCH /notifications/:id/read` - отметка как прочитанное
- `DELETE /notifications/:id` - удаление уведомления
- `GET /notifications/preferences` - получение настроек уведомлений
- `PATCH /notifications/preferences` - обновление настроек уведомлений

### Providers

**NotificationsService**
- `createNotification()` - создание уведомления
- `getUserNotifications()` - получение уведомлений пользователя
- `markAsRead()` - отметка как прочитанное
- `deleteNotification()` - удаление уведомления
- `sendNotification()` - отправка уведомления

**NotificationQueueService**
- `addToQueue()` - добавление в очередь
- `processQueue()` - обработка очереди
- `retryFailed()` - повторная отправка неудачных
- `getQueueStatus()` - получение статуса очереди

**NotificationDeliveryService**
- `sendPushNotification()` - отправка push уведомления
- `sendEmailNotification()` - отправка email уведомления
- `sendInAppNotification()` - отправка in-app уведомления
- `deliverNotification()` - доставка уведомления через выбранный канал

**NotificationPreferencesService**
- `getPreferences()` - получение настроек пользователя
- `updatePreferences()` - обновление настроек
- `shouldSendNotification()` - проверка, нужно ли отправлять уведомление
- `getDefaultPreferences()` - получение настроек по умолчанию

### Modules

**NotificationsModule**
- Импортирует UsersModule для работы с пользователями
- Использует очередь (Bull/BullMQ) для асинхронной обработки

## Типы уведомлений

- Новое сообщение
- Приглашение в чат
- Упоминание в сообщении
- Изменение роли в чате
- Системные уведомления

## Каналы доставки

- **Push** - push уведомления (FCM/APNS)
- **Email** - email уведомления
- **In-app** - уведомления в приложении

## Зависимости

- `@nestjs/bull` - интеграция с очередью Bull
- `bull` или `bullmq` - очередь задач
- `UsersModule` - для работы с пользователями
- Email сервис (SendGrid/SES/etc)
- Push сервис (FCM/APNS)
