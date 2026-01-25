# ChatsModule

Модуль управления чатами (1-1 и групповые).

## Описание

Обеспечивает создание чатов, управление участниками, назначение ролей (owner/admin/member), проверку прав доступа.

## Структура модуля

### Controllers

**ChatsController**
- `POST /chats` - создание нового чата
- `GET /chats` - получение списка чатов пользователя
- `GET /chats/:id` - получение информации о чате
- `PATCH /chats/:id` - обновление информации о чате
- `DELETE /chats/:id` - удаление чата
- `POST /chats/:id/members` - добавление участника
- `DELETE /chats/:id/members/:userId` - удаление участника
- `PATCH /chats/:id/members/:userId/role` - изменение роли участника
- `GET /chats/:id/members` - получение списка участников

### Providers

**ChatsService**
- `createChat()` - создание чата
- `findById()` - поиск чата по ID
- `getUserChats()` - получение чатов пользователя
- `updateChat()` - обновление информации о чате
- `deleteChat()` - удаление чата
- `isUserMember()` - проверка участия пользователя

**ChatMembersService**
- `addMember()` - добавление участника
- `removeMember()` - удаление участника
- `getMembers()` - получение списка участников
- `updateMemberRole()` - изменение роли участника
- `getMemberRole()` - получение роли участника

**ChatRolesService**
- `assignRole()` - назначение роли
- `getRole()` - получение роли
- `hasPermission()` - проверка прав доступа
- `getAvailableRoles()` - получение доступных ролей

**ChatPermissionsService**
- `canEditChat()` - проверка права редактирования
- `canDeleteChat()` - проверка права удаления
- `canAddMembers()` - проверка права добавления участников
- `canRemoveMembers()` - проверка права удаления участников
- `canChangeRoles()` - проверка права изменения ролей

### Modules

**ChatsModule**
- Импортирует UsersModule для работы с пользователями
- Экспортирует ChatsService для использования в других модулях

## Роли

- **owner** - владелец чата, полные права
- **admin** - администратор, может управлять участниками и настройками
- **member** - обычный участник, может отправлять сообщения

## Зависимости

- `UsersModule` - для работы с пользователями
- `TypeORM` - для работы с базой данных
