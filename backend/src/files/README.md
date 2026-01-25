# FilesModule

Модуль работы с файлами и вложениями.

## Описание

Обеспечивает загрузку файлов, управление доступом к файлам, валидацию типов и размеров файлов.

## Структура модуля

### Controllers

**FilesController**
- `POST /files/upload` - загрузка файла
- `GET /files/:id` - получение файла
- `GET /files/:id/download` - скачивание файла
- `DELETE /files/:id` - удаление файла
- `GET /files/:id/metadata` - получение метаданных файла

### Providers

**FilesService**
- `uploadFile()` - загрузка файла
- `getFile()` - получение файла
- `deleteFile()` - удаление файла
- `getFileMetadata()` - получение метаданных
- `generateFileUrl()` - генерация URL для доступа к файлу

**FileStorageService**
- `saveFile()` - сохранение файла (локально/S3/etc)
- `getFileStream()` - получение потока файла
- `deleteFileFromStorage()` - удаление файла из хранилища
- `fileExists()` - проверка существования файла

**FileAccessService**
- `checkAccess()` - проверка прав доступа к файлу
- `grantAccess()` - предоставление доступа
- `revokeAccess()` - отзыв доступа
- `getFilePermissions()` - получение прав доступа

**FileValidationService**
- `validateFileType()` - валидация типа файла
- `validateFileSize()` - валидация размера файла
- `validateFileName()` - валидация имени файла
- `getAllowedTypes()` - получение разрешенных типов

### Modules

**FilesModule**
- Экспортирует FilesService для использования в других модулях (MessagesModule, UsersModule)

## Поддерживаемые типы файлов

- Изображения: jpg, png, gif, webp
- Документы: pdf, doc, docx, txt
- Медиа: mp3, mp4, wav
- (список может быть расширен)

## Зависимости

- `@nestjs/platform-express` - для работы с multipart/form-data
- `multer` - для обработки загрузки файлов
- Хранилище: локальная файловая система или S3 (будет определено)
