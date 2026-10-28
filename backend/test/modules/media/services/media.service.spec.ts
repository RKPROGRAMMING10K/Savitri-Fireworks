import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MediaService } from '../../../../src/modules/media/services/media.service';
import { Media } from '../../../../src/modules/media/entities/media.entity';
import { MinioService } from '../../../../src/modules/storage/services/minio.service';

describe('MediaService', () => {
  let service: MediaService;
  let mediaRepo: any;
  let minioService: any;

  beforeEach(async () => {
    mediaRepo = {
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      })),
      findOne: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => Promise.resolve({ id: 'med-uuid-1', ...entity })),
      remove: jest.fn(),
    };

    minioService = {
      uploadFile: jest.fn().mockResolvedValue('http://localhost:9000/savitri-uploads/media/video.mp4'),
      deleteFile: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MediaService,
        {
          provide: getRepositoryToken(Media),
          useValue: mediaRepo,
        },
        {
          provide: MinioService,
          useValue: minioService,
        },
      ],
    }).compile();

    service = module.get<MediaService>(MediaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should upload video file to MinIO and save media item', async () => {
    const mockFile: any = {
      originalname: 'showcase.mp4',
      buffer: Buffer.from('fake-video-content'),
      size: 1024,
      mimetype: 'video/mp4',
    };

    const dto = {
      type: 'Video',
      title: 'Grand Fireworks Finale',
      shortDesc: 'Stunning aerial fireworks burst',
      tags: 'Aerial, Finale, Sivakasi',
      videoPlatform: 'Direct Video',
    };

    const created = await service.create(dto, mockFile);

    expect(created.type).toBe('Video');
    expect(created.title).toBe('Grand Fireworks Finale');
    expect(created.url).toBe('http://localhost:9000/savitri-uploads/media/video.mp4');
    expect(created.tags).toEqual(['Aerial', 'Finale', 'Sivakasi']);
    expect(minioService.uploadFile).toHaveBeenCalledWith(mockFile, 'media');
    expect(mediaRepo.save).toHaveBeenCalled();
  });

  it('should return empty list when no media in database', async () => {
    const result = await service.findAll();
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });
});

