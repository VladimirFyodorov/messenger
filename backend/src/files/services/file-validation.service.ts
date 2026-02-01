import {
  BadRequestException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class FileValidationService {
  private readonly maxFileSize = 10 * 1024 * 1024; // 10MB
  private readonly allowedMimeTypes = [
    // Images
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    // Documents
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'text/plain',
    // Media
    'audio/mpeg',
    'audio/mp3',
    'video/mp4',
    'video/mpeg',
  ];

  validateFileType(mimeType: string): boolean {
    return this.allowedMimeTypes.includes(mimeType);
  }

  validateFileSize(size: number): boolean {
    return size <= this.maxFileSize;
  }

  validateFileName(filename: string): boolean {
    const invalidChars = /[<>:"/\\|?*]/;
    return !invalidChars.test(filename) && filename.length <= 255;
  }

  validateFile(file: Express.Multer.File): void {
    if (!this.validateFileType(file.mimetype)) {
      throw new BadRequestException(
        `File type ${file.mimetype} is not allowed`,
      );
    }

    if (!this.validateFileSize(file.size)) {
      throw new BadRequestException(
        `File size exceeds maximum allowed size of ${this.maxFileSize} bytes`,
      );
    }

    if (!this.validateFileName(file.originalname)) {
      throw new BadRequestException('Invalid file name');
    }
  }

  getAllowedTypes(): string[] {
    return [...this.allowedMimeTypes];
  }
}
