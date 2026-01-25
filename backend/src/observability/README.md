# ObservabilityModule

Модуль мониторинга, логирования, метрик и healthchecks.

## Описание

Обеспечивает централизованное логирование, сбор метрик, трейсинг запросов, healthchecks для проверки состояния сервисов.

## Структура модуля

### Controllers

**HealthController**
- `GET /health` - общий healthcheck
- `GET /health/live` - liveness probe
- `GET /health/ready` - readiness probe
- `GET /health/db` - проверка состояния базы данных
- `GET /health/redis` - проверка состояния Redis (если используется)

### Providers

**LoggerService**
- `log()` - логирование информационных сообщений
- `error()` - логирование ошибок
- `warn()` - логирование предупреждений
- `debug()` - отладочное логирование
- `setContext()` - установка контекста логирования

**MetricsService**
- `incrementCounter()` - увеличение счетчика
- `recordHistogram()` - запись гистограммы
- `setGauge()` - установка метрики
- `recordTiming()` - запись времени выполнения
- `exportMetrics()` - экспорт метрик (Prometheus format)

**TracingService**
- `startSpan()` - начало span для трейсинга
- `endSpan()` - окончание span
- `addSpanTag()` - добавление тега к span
- `recordException()` - запись исключения в span
- `injectContext()` - инъекция контекста трейсинга

**HealthService**
- `checkDatabase()` - проверка подключения к БД
- `checkRedis()` - проверка подключения к Redis
- `checkExternalServices()` - проверка внешних сервисов
- `getHealthStatus()` - получение общего статуса здоровья

### Modules

**ObservabilityModule**
- Глобальный модуль для использования во всем приложении
- Настраивает логирование, метрики, трейсинг
- Экспортирует сервисы для использования в других модулях

## Метрики

- Количество запросов по эндпоинтам
- Время ответа API
- Количество ошибок
- Количество активных WebSocket соединений
- Использование памяти и CPU

## Healthchecks

- **Liveness** - проверка, что приложение запущено
- **Readiness** - проверка готовности принимать запросы
- **Database** - проверка подключения к БД
- **Redis** - проверка подключения к Redis (если используется)

## Зависимости

- `@nestjs/terminus` - для healthchecks
- `winston` или `pino` - для логирования
- `prom-client` - для метрик Prometheus
- `@opentelemetry/api` - для трейсинга (опционально)
