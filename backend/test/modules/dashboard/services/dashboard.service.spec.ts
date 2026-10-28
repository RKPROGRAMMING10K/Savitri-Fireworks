import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DashboardService } from '../../../../src/modules/dashboard/services/dashboard.service';
import { Enquiry } from '../../../../src/modules/enquiries/entities/enquiry.entity';
import { Product } from '../../../../src/modules/products/entities/product.entity';
import { Category } from '../../../../src/modules/categories/entities/category.entity';
import { Store } from '../../../../src/modules/stores/entities/store.entity';
import { Media } from '../../../../src/modules/media/entities/media.entity';

describe('DashboardService', () => {
  let service: DashboardService;
  let enquiryRepo: any;
  let productRepo: any;
  let categoryRepo: any;
  let storeRepo: any;
  let mediaRepo: any;

  beforeEach(async () => {
    enquiryRepo = {
      count: jest.fn().mockResolvedValue(0),
      find: jest.fn().mockResolvedValue([]),
    };

    productRepo = {
      count: jest.fn().mockResolvedValue(0),
    };

    categoryRepo = {
      count: jest.fn().mockResolvedValue(0),
    };

    storeRepo = {
      count: jest.fn().mockResolvedValue(0),
    };

    mediaRepo = {
      count: jest.fn().mockResolvedValue(0),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DashboardService,
        { provide: getRepositoryToken(Enquiry), useValue: enquiryRepo },
        { provide: getRepositoryToken(Product), useValue: productRepo },
        { provide: getRepositoryToken(Category), useValue: categoryRepo },
        { provide: getRepositoryToken(Store), useValue: storeRepo },
        { provide: getRepositoryToken(Media), useValue: mediaRepo },
      ],
    }).compile();

    service = module.get<DashboardService>(DashboardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return aggregated stats with 0 items for empty database', async () => {
    const stats = await service.getStats();

    expect(stats.totalEnquiries).toBe(0);
    expect(stats.pendingEnquiries).toBe(0);
    expect(stats.totalProducts).toBe(0);
    expect(stats.totalStores).toBe(0);
    expect(stats.totalMedia).toBe(0);
    expect(stats.monthlyStats).toHaveLength(6);
    expect(stats.recentEnquiries).toEqual([]);
    expect(stats.databaseStatus).toBe('Active');
  });

  it('should accurately aggregate inquiries by month and type', async () => {
    enquiryRepo.count.mockResolvedValueOnce(3); // total
    enquiryRepo.count.mockResolvedValueOnce(1); // pending
    enquiryRepo.count.mockResolvedValueOnce(1); // contacted
    enquiryRepo.count.mockResolvedValueOnce(1); // resolved
    productRepo.count.mockResolvedValueOnce(5);
    categoryRepo.count.mockResolvedValueOnce(2);
    storeRepo.count.mockResolvedValueOnce(4);
    mediaRepo.count.mockResolvedValueOnce(8);

    const now = new Date();
    const mockRecent = [
      {
        id: 'e-1',
        code: 'ENQ-001',
        name: 'User 1',
        email: 'u1@example.com',
        phone: '1234567890',
        enquiryType: 'Dealer',
        subject: 'Dealership request',
        status: 'Pending',
        createdAt: now,
      },
    ];

    enquiryRepo.find.mockResolvedValueOnce(mockRecent); // recent
    enquiryRepo.find.mockResolvedValueOnce([
      { id: 'e-1', enquiryType: 'Dealer', createdAt: now },
      { id: 'e-2', enquiryType: 'Customer', createdAt: now },
    ]); // all for stats

    const stats = await service.getStats();

    expect(stats.totalEnquiries).toBe(3);
    expect(stats.pendingEnquiries).toBe(1);
    expect(stats.totalProducts).toBe(5);
    expect(stats.totalStores).toBe(4);
    expect(stats.totalMedia).toBe(8);
    expect(stats.recentEnquiries).toHaveLength(1);
    expect(stats.recentEnquiries[0].code).toBe('ENQ-001');

    // Current month in monthlyStats should reflect the 2 entries
    const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentMonthStat = stats.monthlyStats.find((m) => m.key === currentMonthKey);
    expect(currentMonthStat).toBeDefined();
    expect(currentMonthStat?.dealer).toBe(1);
    expect(currentMonthStat?.customer).toBe(1);
    expect(currentMonthStat?.total).toBe(2);
  });
});

