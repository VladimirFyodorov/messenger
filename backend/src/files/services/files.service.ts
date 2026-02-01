import * as fs from 'fs';
import * as path from 'path';
import { Repository } from 'typeorm';

import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';

import { File } from '../entities/file.entity';

@Injectable()
export class FilesService {
  private readonly uploadDir: string;

  constructor(
    @InjectRepository(File)
    private filesRepository: Repository<File>,
    configService: ConfigService,
  ) {
    this.uploadDir = configService.get<string>('files.uploadDir') ?? './uploads';
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  async uploadFile(
    file: Express.Multer.File,
    userId: string,
    metadata?: Record<string, any>,
  ): Promise<File> {
    const fileExtension = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}${fileExtension}`;
    const filePath = path.join(this.uploadDir, fileName);

    fs.writeFileSync(filePath, file.buffer);

    const fileEntity = this.filesRepository.create({
      filename: fileName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
      path: filePath,
      url: `/files/${fileName}`,
      uploadedById: userId,
      metadata: metadata || {},
    });

    return this.filesRepository.save(fileEntity);
  }

  async getFile(id: string): Promise<File> {
    const file = await this.filesRepository.findOne({ where: { id } });
    if (!file) {
      throw new NotFoundException('File not found');
    }
    return file;
  }

  async getFileStream(id: string): Promise<{ stream: fs.ReadStream; file: File }> {
    const file = await this.getFile(id);
    if (!fs.existsSync(file.path)) {
      throw new NotFoundException('File not found on disk');
    }
    const stream = fs.createReadStream(file.path);
    return { stream, file };
  }

  async deleteFile(id: string, userId: string): Promise<void> {
    const file = await this.getFile(id);
    if (file.uploadedById !== userId) {
      throw new Error('You can only delete your own files');
    }

    if (fs.existsSync(file.path)) {
      fs.unlinkSync(file.path);
    }

    await this.filesRepository.delete(id);
  }

  async getFileMetadata(id: string): Promise<File> {
    return this.getFile(id);
  }

  async generateFileUrl(id: string): Promise<string> {
    const file = await this.getFile(id);
    return file.url || `/files/${file.id}/download`;
  }
}
