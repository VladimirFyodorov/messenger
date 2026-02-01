import {
  Request as ExpressRequest,
  Response,
} from 'express';

import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Request,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FileValidationService } from './services/file-validation.service';
import { FilesService } from './services/files.service';

@Controller('files')
@UseGuards(JwtAuthGuard)
export class FilesController {
  constructor(
    private filesService: FilesService,
    private fileValidationService: FileValidationService,
  ) {}

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Request() req: ExpressRequest & { user: { id: string } },
  ) {
    if (!file) {
      throw new Error('No file provided');
    }

    this.fileValidationService.validateFile(file);
    return this.filesService.uploadFile(file, req.user.id);
  }

  @Get(':id')
  async getFile(@Param('id') id: string) {
    return this.filesService.getFileMetadata(id);
  }

  @Get(':id/download')
  async downloadFile(@Param('id') id: string, @Res() res: Response) {
    const { stream, file } = await this.filesService.getFileStream(id);
    res.setHeader('Content-Type', file.mimeType);
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="${file.originalName}"`,
    );
    stream.pipe(res);
  }

  @Delete(':id')
  async deleteFile(@Param('id') id: string, @Request() req: ExpressRequest & { user: { id: string } }) {
    await this.filesService.deleteFile(id, req.user.id);
    return { message: 'File deleted' };
  }

  @Get(':id/metadata')
  async getMetadata(@Param('id') id: string) {
    return this.filesService.getFileMetadata(id);
  }
}
