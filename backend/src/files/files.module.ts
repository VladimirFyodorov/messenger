import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from '../auth/auth.module';
import { File } from './entities/file.entity';
import { FilesController } from './files.controller';
import { FileValidationService } from './services/file-validation.service';
import { FilesService } from './services/files.service';

@Module({
  imports: [TypeOrmModule.forFeature([File]), AuthModule],
  controllers: [FilesController],
  providers: [FilesService, FileValidationService],
  exports: [FilesService],
})
export class FilesModule {}
