# AuthModule

Модуль аутентификации и авторизации пользователей.

## Описание

Обеспечивает регистрацию, вход, обновление токенов, интеграцию с Google OAuth2 и управление сессиями пользователей.

## Структура модуля

### Controllers

**AuthController**
- `POST /auth/register` - регистрация нового пользователя
- `POST /auth/login` - вход пользователя
- `POST /auth/refresh` - обновление JWT токена
- `POST /auth/logout` - выход пользователя
- `GET /auth/google` - инициация Google OAuth2
- `GET /auth/google/callback` - callback для Google OAuth2
- `GET /auth/sessions` - получение активных сессий пользователя
- `DELETE /auth/sessions/:id` - удаление сессии

### Providers

**AuthService**
- `register()` - регистрация пользователя
- `login()` - аутентификация пользователя
- `validateUser()` - валидация учетных данных
- `refreshToken()` - обновление токена
- `logout()` - выход из системы
- `googleAuth()` - обработка Google OAuth2

**JwtStrategy**
- Passport стратегия для JWT токенов
- Валидация токенов из заголовков

**GoogleStrategy**
- Passport стратегия для Google OAuth2
- Обработка OAuth2 flow

**TokenService**
- `generateAccessToken()` - генерация access token
- `generateRefreshToken()` - генерация refresh token
- `validateToken()` - валидация токена
- `decodeToken()` - декодирование токена

**SessionService**
- `createSession()` - создание сессии
- `getUserSessions()` - получение сессий пользователя
- `revokeSession()` - отзыв сессии
- `revokeAllSessions()` - отзыв всех сессий

### Modules

**AuthModule**
- Импортирует необходимые зависимости (JwtModule, PassportModule)
- Экспортирует AuthService и Guards для использования в других модулях

## Зависимости

- `@nestjs/passport` - Passport интеграция
- `@nestjs/jwt` - JWT токены
- `passport-jwt` - JWT стратегия
- `passport-google-oauth20` - Google OAuth2 стратегия
- `UsersModule` - для работы с пользователями
