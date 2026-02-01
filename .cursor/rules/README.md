# Cursor Rules

Правила для агента при работе с проектом messenger.

| Файл | Описание | Применение |
|------|----------|------------|
| **task-workflow.mdc** | План → одобрение → выполнение → тесты/линт/билд → самари, README в модулях | always |
| **project.mdc** | Инкременты, milestones, верификация | always |
| **security.mdc** | Валидация, секреты, human-in-the-loop, least privilege | `backend/**/*.ts` |
| **code-quality.mdc** | TypeScript, именование, ошибки, производительность | `**/*.{ts,tsx}` |
| **testing.mdc** | Unit/integration, Jest, паттерны тестов | `**/*.spec.ts` |
| **backend.mdc** | NestJS 10, TypeORM, DTO, примеры, deprecated | `backend/**/*.ts` |
| **frontend.mdc** | Next.js 16 App Router, React 19, Tailwind | `frontend/**/*.{ts,tsx}` |

Обновлять правила при смене стека или конвенций.
