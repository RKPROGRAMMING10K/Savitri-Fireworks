import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ProductsService } from '../../../../src/modules/products/services/products.service';
import { Product } from '../../../../src/modules/products/entities/product.entity';
import { Category } from '../../../../src/modules/categories/entities/category.entity';
import { MinioService } from '../../../../src/modules/storage/services/minio.service';
import { CategoriesService } from '../../../../src/modules/categories/services/categories.service';

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepo: any;
  let categoryRepo: any;
  let minioService: any;
  let categoriesService: any;

  beforeEach(async () => {
    productRepo = {
      createQueryBuilder: jest.fn(() => ({
        leftJoinAndSelect: jest.fn().mockReturnThis(),
        orderBy: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        take: jest.fn().mockReturnThis(),
        andWhere: jest.fn().mockReturnThis(),
        getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
      })),
      findOne: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => Promise.resolve({ id: 'prod-uuid-1', ...entity })),
      remove: jest.fn(),
      count: jest.fn().mockResolvedValue(4),
    };

    categoryRepo = {
      findOne: jest.fn(),
      count: jest.fn().mockResolvedValue(5),
    };

    minioService = {
      uploadFile: jest.fn().mockResolvedValue('http://localhost:9000/savitri-uploads/products/image.png'),
      deleteFile: jest.fn().mockResolvedValue(undefined),
    };

    categoriesService = {
      findOne: jest.fn(),
      findAll: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getRepositoryToken(Product),
          useValue: productRepo,
        },
        {
          provide: getRepositoryToken(Category),
          useValue: categoryRepo,
        },
        {
          provide: MinioService,
          useValue: minioService,
        },
        {
          provide: CategoriesService,
          useValue: categoriesService,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create product with auto-generated code and minio image', async () => {
    const mockCategory = {
      id: 'a0000000-0000-0000-0000-000000000001',
      name: 'Sparklers',
      codePrefix: 'SPK',
    };
    categoryRepo.findOne.mockResolvedValue(mockCategory);
    productRepo.findOne.mockResolvedValue(null); // No existing product code

    const mockFile: any = {
      originalname: 'sparkler.jpg',
      buffer: Buffer.from('fake'),
      size: 4,
      mimetype: 'image/jpeg',
    };

    const dto = {
      name: 'Super Sparklers',
      categoryId: mockCategory.id,
      shortDesc: 'Golden sparkles',
      description: 'Long burning sparkler',
    };

    const created = await service.create(dto, mockFile);

    expect(created.code).toBe('SF-SPK01');
    expect(created.image).toBe('http://localhost:9000/savitri-uploads/products/image.png');
    expect(minioService.uploadFile).toHaveBeenCalledWith(mockFile, 'products');
    expect(productRepo.save).toHaveBeenCalled();
  });
});

