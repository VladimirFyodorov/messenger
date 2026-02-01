# RealtimeModule

Модуль real-time коммуникации через WebSocket.

## Описание

Обеспечивает real-time обмен сообщениями, статусы присутствия (online/offline), typing indicators, события для других модулей.

## Структура модуля

### Controllers

**RealtimeGateway** (WebSocket Gateway)
- `@WebSocketGateway()` - основной gateway
- `handleConnection()` - обработка подключения
- `handleDisconnect()` - обработка отключения
- `@SubscribeMessage('message:send')` - отправка сообщения
- `@SubscribeMessage('message:typing')` - typing indicator
- `@SubscribeMessage('presence:update')` - обновление статуса присутствия
- `@SubscribeMessage('chat:join')` - присоединение к чату
- `@SubscribeMessage('chat:leave')` - выход из чата

### Providers

**RealtimeListener** (EventEmitter)
- Слушает `message.created` — эмитит `message:new` в chat:{chatId}
- Слушает `chat.created` — эмитит `chat:created` в user:{userId} всем участникам

**RealtimeService**
- `emitMessage()` - отправка сообщения через WebSocket
- `emitTyping()` - отправка typing indicator
- `emitPresenceUpdate()` - отправка обновления статуса
- `joinChatRoom()` - присоединение к комнате чата
- `leaveChatRoom()` - выход из комнаты чата
- `broadcastToChat()` - широковещательная отправка в чат
- `emitToUsers()` - отправка события указанным пользователям (user:{userId})

**PresenceService**
- `setOnline()` - установка статуса online
- `setOffline()` - установка статуса offline
- `getUserStatus()` - получение статуса пользователя
- `getOnlineUsers()` - получение списка онлайн пользователей
- `trackUserActivity()` - отслеживание активности пользователя

**TypingService**
- `startTyping()` - начало набора текста
- `stopTyping()` - окончание набора текста
- `getTypingUsers()` - получение списка набирающих пользователей
- `clearTyping()` - очистка typing indicator

**EventEmitter**
- Эмиссия событий для интеграции с другими модулями
- События: `message.created`, `message.updated`, `user.online`, `user.offline`, `user.typing`

### Modules

**RealtimeModule**
- Импортирует MessagesModule для работы с сообщениями
- Импортирует ChatsModule для работы с чатами
- Импортирует UsersModule для работы с пользователями
- Экспортирует RealtimeService для использования в других модулях

## WebSocket события

### Клиент -> Сервер
- `message:send` - отправка сообщения
- `message:typing` - индикатор набора текста
- `presence:update` - обновление статуса присутствия
- `chat:join` - присоединение к чату
- `chat:leave` - выход из чата

### Сервер -> Клиент
- `message:new` - новое сообщение (в комнату chat:{chatId}, при создании через HTTP или WebSocket)
- `chat:created` - новый чат (в комнату user:{userId} каждому участнику)
- `message:updated` - обновленное сообщение
- `message:deleted` - удаленное сообщение
- `message:status` - обновление статуса сообщения
- `typing:start` - начало набора текста
- `typing:stop` - окончание набора текста
- `presence:online` - пользователь онлайн
- `presence:offline` - пользователь офлайн

## Зависимости

- `@nestjs/websockets` - WebSocket поддержка
- `socket.io` - WebSocket библиотека
- `MessagesModule` - для работы с сообщениями
- `ChatsModule` - для работы с чатами
- `UsersModule` - для работы с пользователями
