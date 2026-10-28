import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CategoriesService } from '../../../../src/modules/categories/services/categories.service';
import { Category } from '../../../../src/modules/categories/entities/category.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;
  let categoryRepo: any;

  beforeEach(async () => {
    categoryRepo = {
      find: jest.fn(),
      findOne: jest.fn(),
      create: jest.fn((dto) => dto),
      save: jest.fn((entity) => Promise.resolve({ id: 'cat-uuid-1', ...entity })),
      remove: jest.fn(),
      count: jest.fn().mockResolvedValue(5),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: categoryRepo,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return categories with children', async () => {
    const mockCategories = [
      { id: '1', name: 'Traditional Crackers', children: [{ id: '2', name: 'Sparklers' }] },
    ];
    categoryRepo.find.mockResolvedValue(mockCategories);

    const result = await service.findAll();
    expect(result).toEqual(mockCategories);
    expect(categoryRepo.find).toHaveBeenCalled();
  });

  it('should find one category by id or slug', async () => {
    const mockCat = { id: 'uuid-1', name: 'Sparklers', slug: 'sparklers' };
    categoryRepo.findOne.mockResolvedValue(mockCat);

    const result = await service.findOne('sparklers');
    expect(result).toEqual(mockCat);
  });
});

