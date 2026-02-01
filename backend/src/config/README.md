# Config

Типизированный конфиг через `ConfigModule` и `asyncConfigFactory`.

- **types.ts** — DTO (class-validator): `Config`, `AppConfig`, `InfraConfig`, `AuthConfig`, …
- **config.factory.ts** — `asyncConfigFactory()`: читает `process.env`, собирает объект, `plainToClass` + `validateSync`.
- **configuration.module.ts** — `ConfigurationModule`: `ConfigModule.forRoot({ isGlobal: true, load: [asyncConfigFactory] })`.

В `AppModule` импортируется `ConfigurationModule`. Остальные модули используют `ConfigService.get('auth.jwt.secret')`, `get('infra.db.host')` и т.д.
