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

## План реализации

### Этап 1: Подготовка инфраструктуры
- [x] Создать User entity (если отсутствует в UsersModule)
- [x] Создать Session entity для управления сессиями
- [x] Создать DTOs (RegisterDto, LoginDto, RefreshTokenDto, AuthResponseDto)
- [x] Настроить JwtModule в AuthModule

### Этап 2: Базовые сервисы
- [x] Реализовать TokenService (генерация/валидация JWT токенов)
- [x] Реализовать SessionService (CRUD операции с сессиями)
- [x] Реализовать JwtStrategy (Passport стратегия для JWT)

### Этап 3: Основная логика авторизации
- [x] Реализовать AuthService (register, login, validateUser, refreshToken, logout)
- [x] Создать Guards (JwtAuthGuard, OptionalJwtAuthGuard)
- [x] Реализовать AuthController (register, login, refresh, logout, sessions)

### Этап 4: Google OAuth2 ✅

- [x] 1. GoogleStrategy (`strategies/google.strategy.ts`): Passport + `passport-google-oauth20`, env, callback `/auth/google/callback`, `validate()` → профиль.
- [x] 2. AuthService: `googleAuth(profile)` — lookup by googleId/email, create/link user, tokens, session, AuthResponseDto.
- [x] 3. AuthController: `GET /auth/google`, `GET /auth/google/callback` с `AuthGuard('google')`, вызов `googleAuth(req.user)`.
- [x] 4. AuthModule: GoogleStrategy в providers.
- [x] 5. UsersService: `findByGoogleId`, `updateGoogleId`, `updateFromGoogleProfile`, `create()` без пароля.
- [x] 6. Тесты: unit (GoogleStrategy, `googleAuth`).
- [x] 7. Env: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_CALLBACK_URL`. Опционально `OAUTH_SUCCESS_REDIRECT_URL` (по умолчанию `http://localhost:3001`) — редирект с `access_token` и `refresh_token` после успешного входа.

### Этап 5: Интеграция и тестирование
- [ ] Интегрировать с UsersModule
- [ ] Добавить валидацию через class-validator
- [ ] Протестировать все endpoints

## Первые шаги

### Шаг 1: Создание сущностей
1. **User entity** (в UsersModule или общий entities):
   - `id: UUID`
   - `email: string` (unique)
   - `password: string` (hashed)
   - `googleId?: string` (для OAuth)
   - `createdAt: Date`
   - `updatedAt: Date`

2. **Session entity**:
   - `id: UUID`
   - `userId: UUID` (FK to User)
   - `refreshToken: string` (hashed)
   - `deviceInfo?: string`
   - `ipAddress?: string`
   - `createdAt: Date`
   - `expiresAt: Date`

### Шаг 2: Создание DTOs
- `RegisterDto`: email, password, confirmPassword
- `LoginDto`: email, password
- `RefreshTokenDto`: refreshToken
- `AuthResponseDto`: accessToken, refreshToken, user

### Шаг 3: Настройка JwtModule
```typescript
JwtModule.register({
  secret: process.env.JWT_SECRET,
  signOptions: { expiresIn: process.env.JWT_EXPIRES_IN },
})
```

### Шаг 4: Реализация TokenService
- Использовать JwtService для генерации токенов
- Хеширование refresh токенов перед сохранением
- Валидация и декодирование токенов

## Что не хватает для начала работы

### Обязательно:
1. **Google OAuth2 credentials**:
   - `GOOGLE_CLIENT_ID` - Client ID из Google Cloud Console
   - `GOOGLE_CLIENT_SECRET` - Client Secret из Google Cloud Console
   - Настроить redirect URI в Google Console: `http://localhost:3000/auth/google/callback`

2. **User entity**:
   - Нужно создать User entity в UsersModule или определить где она будет находиться
   - Поля: id, email, password (hashed), googleId (optional), timestamps

3. **JWT секреты**:
   - Убедиться что `JWT_SECRET` в `.env` установлен (для production использовать сильный секрет)

### Опционально (для полной функциональности):
- Настройка Redis для хранения сессий (если планируется распределенная система)
- Настройка rate limiting для защиты от брутфорса
- Email верификация (если требуется)
