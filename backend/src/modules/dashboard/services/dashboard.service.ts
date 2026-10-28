import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Enquiry, EnquiryStatus } from '../../enquiries/entities/enquiry.entity';
import { Product } from '../../products/entities/product.entity';
import { Category } from '../../categories/entities/category.entity';
import { Store } from '../../stores/entities/store.entity';
import { Media } from '../../media/entities/media.entity';
import { DashboardStatsResponseDto, DashboardMonthlyStat } from '../dto/dashboard-stats.dto';

@Injectable()
export class DashboardService {
  private readonly logger = new Logger(DashboardService.name);

  constructor(
    @InjectRepository(Enquiry)
    private readonly enquiryRepository: Repository<Enquiry>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async getStats(): Promise<DashboardStatsResponseDto> {
    const [
      totalEnquiries,
      pendingEnquiries,
      contactedEnquiries,
      resolvedEnquiries,
      totalProducts,
      totalCategories,
      totalStores,
      totalMedia,
      recentEnquiries,
      allEnquiriesForStats,
    ] = await Promise.all([
      this.enquiryRepository.count(),
      this.enquiryRepository.count({ where: { status: EnquiryStatus.PENDING } }),
      this.enquiryRepository.count({ where: { status: EnquiryStatus.CONTACTED } }),
      this.enquiryRepository.count({ where: { status: EnquiryStatus.RESOLVED } }),
      this.productRepository.count(),
      this.categoryRepository.count(),
      this.storeRepository.count(),
      this.mediaRepository.count(),
      this.enquiryRepository.find({
        order: { createdAt: 'DESC' },
        take: 5,
        select: ['id', 'code', 'name', 'email', 'phone', 'enquiryType', 'subject', 'status', 'createdAt'],
      }),
      this.enquiryRepository.find({
        select: ['id', 'enquiryType', 'createdAt'],
      }),
    ]);

    // Build monthly breakdown for past 6 months
    const now = new Date();
    const monthlyStats: DashboardMonthlyStat[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const name = d.toLocaleString('en-US', { month: 'short' });
      monthlyStats.push({ name, key, dealer: 0, customer: 0, total: 0 });
    }

    allEnquiriesForStats.forEach((enq) => {
      const date = new Date(enq.createdAt);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const match = monthlyStats.find((m) => m.key === key);
      if (match) {
        if (enq.enquiryType === 'Dealer') {
          match.dealer += 1;
        } else {
          match.customer += 1;
        }
        match.total += 1;
      }
    });

    // Compute uptime string
    const uptimeSec = Math.floor(process.uptime());
    const days = Math.floor(uptimeSec / (3600 * 24));
    const hours = Math.floor((uptimeSec % (3600 * 24)) / 3600);
    const minutes = Math.floor((uptimeSec % 3600) / 60);
    const uptimeStr = days > 0 ? `${days}d ${hours}h` : hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

    return {
      totalEnquiries,
      pendingEnquiries,
      contactedEnquiries,
      resolvedEnquiries,
      totalProducts,
      totalCategories,
      totalStores,
      totalMedia,
      monthlyStats,
      recentEnquiries,
      systemUptime: uptimeStr || '1m',
      databaseStatus: 'Active',
    };
  }
}

