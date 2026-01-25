# UsersModule

Модуль управления пользователями и их профилями.

## Описание

Обеспечивает управление профилями пользователей, загрузку аватаров, настройки пользователей.

## Структура модуля

### Controllers

**UsersController**
- `GET /users/me` - получение текущего профиля
- `GET /users/:id` - получение профиля пользователя
- `PATCH /users/me` - обновление профиля
- `POST /users/me/avatar` - загрузка аватара
- `DELETE /users/me/avatar` - удаление аватара
- `GET /users/me/settings` - получение настроек
- `PATCH /users/me/settings` - обновление настроек

### Providers

**UsersService**
- `findById()` - поиск пользователя по ID
- `findByEmail()` - поиск пользователя по email
- `updateProfile()` - обновление профиля
- `getProfile()` - получение профиля

**ProfileService**
- `getProfile()` - получение полного профиля
- `updateProfile()` - обновление данных профиля
- `validateProfileData()` - валидация данных профиля

**AvatarService**
- `uploadAvatar()` - загрузка аватара
- `deleteAvatar()` - удаление аватара
- `getAvatarUrl()` - получение URL аватара
- `processAvatar()` - обработка изображения (resize, format)

**SettingsService**
- `getSettings()` - получение настроек пользователя
- `updateSettings()` - обновление настроек
- `getDefaultSettings()` - получение настроек по умолчанию

### Modules

**UsersModule**
- Экспортирует UsersService для использования в других модулях (например, AuthModule)

## Зависимости

- `FilesModule` - для работы с аватарами
- `TypeORM` - для работы с базой данных
