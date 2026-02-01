import { Repository } from 'typeorm';

import { NotFoundException } from '@nestjs/common';
import {
  Test,
  TestingModule,
} from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';

import { File } from '../entities/file.entity';
import { FilesService } from './files.service';

jest.mock('fs');

describe('FilesService', () => {
  let service: FilesService;
  let repository: Repository<File>;

  const mockFile: File = {
    id: '1',
    filename: 'test.jpg',
    originalName: 'test.jpg',
    mimeType: 'image/jpeg',
    size: 1024,
    path: './uploads/test.jpg',
    url: '/files/test.jpg',
    uploadedById: '1',
    uploadedBy: null,
    metadata: {},
    createdAt: new Date(),
  };

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    findOne: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FilesService,
        {
          provide: getRepositoryToken(File),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<FilesService>(FilesService);
    repository = module.get<Repository<File>>(getRepositoryToken(File));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFile', () => {
    it('should return a file when found', async () => {
      mockRepository.findOne.mockResolvedValue(mockFile);

      const result = await service.getFile('1');

      expect(result).toEqual(mockFile);
    });

    it('should throw NotFoundException when file not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.getFile('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getFileMetadata', () => {
    it('should return file metadata', async () => {
      mockRepository.findOne.mockResolvedValue(mockFile);

      const result = await service.getFileMetadata('1');

      expect(result).toEqual(mockFile);
    });
  });
});
