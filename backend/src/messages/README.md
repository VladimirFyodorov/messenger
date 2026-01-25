# MessagesModule

Модуль управления сообщениями и их статусами.

## Описание

Обеспечивает отправку и получение сообщений, управление статусами доставки (sent/delivered/read), поиск по сообщениям и диалогам, пагинацию истории сообщений.

## Структура модуля

### Controllers

**MessagesController**
- `POST /chats/:chatId/messages` - отправка сообщения
- `GET /chats/:chatId/messages` - получение истории сообщений (с пагинацией)
- `GET /chats/:chatId/messages/:id` - получение конкретного сообщения
- `PATCH /chats/:chatId/messages/:id` - редактирование сообщения
- `DELETE /chats/:chatId/messages/:id` - удаление сообщения
- `POST /chats/:chatId/messages/:id/read` - отметка сообщения как прочитанного
- `GET /search/messages` - поиск по сообщениям
- `GET /search/chats` - поиск по диалогам (по названию/участникам)

### Providers

**MessagesService**
- `createMessage()` - создание сообщения
- `findById()` - поиск сообщения по ID
- `getChatMessages()` - получение сообщений чата
- `updateMessage()` - обновление сообщения
- `deleteMessage()` - удаление сообщения (soft delete)
- `validateMessage()` - валидация сообщения

**MessageStatusService**
- `markAsSent()` - отметка как отправлено
- `markAsDelivered()` - отметка как доставлено
- `markAsRead()` - отметка как прочитано
- `getMessageStatus()` - получение статуса сообщения
- `getUnreadCount()` - получение количества непрочитанных сообщений

**MessageSearchService**
- `searchMessages()` - поиск по тексту сообщений
- `searchChats()` - поиск чатов по названию
- `searchChatsByMembers()` - поиск чатов по участникам
- `buildSearchQuery()` - построение поискового запроса

**MessageHistoryService**
- `getMessagesPaginated()` - получение сообщений с пагинацией
- `getMessagesBefore()` - получение сообщений до определенной даты
- `getMessagesAfter()` - получение сообщений после определенной даты
- `calculatePagination()` - расчет параметров пагинации

### Modules

**MessagesModule**
- Импортирует ChatsModule для проверки доступа к чатам
- Импортирует UsersModule для работы с отправителями
- Импортирует FilesModule для вложений в сообщениях
- Экспортирует MessagesService для использования в RealtimeModule

## Статусы сообщений

- **sent** - отправлено
- **delivered** - доставлено
- **read** - прочитано

## Зависимости

- `ChatsModule` - для проверки доступа к чатам
- `UsersModule` - для работы с пользователями
- `FilesModule` - для вложений
- `TypeORM` - для работы с базой данных
