import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StoresService } from '../../../../src/modules/stores/services/stores.service';
import { Store } from '../../../../src/modules/stores/entities/store.entity';

describe('StoresService', () => {
  let service: StoresService;
  let storeRepo: any;

  beforeEach(async () => {
    storeRepo = {
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
      save: jest.fn((entity) => Promise.resolve({ id: 'str-uuid-1', ...entity })),
      remove: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoresService,
        {
          provide: getRepositoryToken(Store),
          useValue: storeRepo,
        },
      ],
    }).compile();

    service = module.get<StoresService>(StoresService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should correctly parse iframe embed string into src URL', () => {
    const iframeCode = '<iframe src="https://www.google.com/maps/embed?pb=test1234" width="600"></iframe>';
    const parsed = service.parseMapUrl(iframeCode);
    expect(parsed).toBe('https://www.google.com/maps/embed?pb=test1234');
  });

  it('should correctly convert address/query into Google Maps embed URL', () => {
    const address = 'Sivakasi, Tamil Nadu';
    const parsed = service.parseMapUrl('', address);
    expect(parsed).toContain('maps.google.com/maps?q=');
    expect(parsed).toContain('output=embed');
  });

  it('should create store with auto-generated code STR-001', async () => {
    storeRepo.findOne.mockResolvedValue(null);

    const dto = {
      name: 'Savitri Parola Store',
      address: 'SH 48, Bodarde',
      city: 'Parola',
      state: 'Maharashtra',
      contact: '+91 2597 293 116',
      mapUrl: '<iframe src="https://maps.google.com/maps?q=Parola"></iframe>',
    };

    const created = await service.create(dto);
    expect(created.code).toBe('STR-001');
    expect(created.mapUrl).toBe('https://maps.google.com/maps?q=Parola');
    expect(storeRepo.save).toHaveBeenCalled();
  });
});

