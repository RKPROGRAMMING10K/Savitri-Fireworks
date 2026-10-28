import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Store } from '../entities/store.entity';
import { CreateStoreDto } from '../dto/create-store.dto';
import { UpdateStoreDto } from '../dto/update-store.dto';
import { StoreQueryDto } from '../dto/store-query.dto';

@Injectable()
export class StoresService {
  private readonly logger = new Logger(StoresService.name);

  constructor(
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async findAll(query: StoreQueryDto = {}) {
    const { search, state, city, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.storeRepository
      .createQueryBuilder('store')
      .where('store.isActive = :isActive', { isActive: true })
      .orderBy('store.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (state && state !== 'All') {
      queryBuilder.andWhere('store.state ILIKE :state', { state: `%${state.trim()}%` });
    }

    if (city && city !== 'All') {
      queryBuilder.andWhere('store.city ILIKE :city', { city: `%${city.trim()}%` });
    }

    if (search && search.trim()) {
      const s = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(store.name ILIKE :search OR store.code ILIKE :search OR store.city ILIKE :search OR store.state ILIKE :search OR store.address ILIKE :search)',
        { search: s },
      );
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<Store> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const store = await this.storeRepository.findOne({
      where: isUuid ? { id } : { code: id },
    });

    if (!store) {
      throw new NotFoundException(`Store with ID or code '${id}' not found.`);
    }

    return store;
  }

  async create(createStoreDto: CreateStoreDto): Promise<Store> {
    const code = await this.generateStoreCode();
    const fallbackAddress = `${createStoreDto.address}, ${createStoreDto.city}, ${createStoreDto.state}, ${createStoreDto.country || 'India'}`;
    const embedMapUrl = this.parseMapUrl(createStoreDto.mapUrl, fallbackAddress);

    const store = this.storeRepository.create({
      code,
      name: createStoreDto.name,
      address: createStoreDto.address,
      city: createStoreDto.city,
      state: createStoreDto.state,
      country: createStoreDto.country || 'India',
      hours: createStoreDto.hours || '9:00 AM - 8:00 PM (Daily)',
      contact: createStoreDto.contact || '+91 2597 293 116',
      mapUrl: embedMapUrl,
    });

    return this.storeRepository.save(store);
  }

  async update(id: string, updateStoreDto: UpdateStoreDto): Promise<Store> {
    const store = await this.findOne(id);

    if (updateStoreDto.name !== undefined) store.name = updateStoreDto.name;
    if (updateStoreDto.address !== undefined) store.address = updateStoreDto.address;
    if (updateStoreDto.city !== undefined) store.city = updateStoreDto.city;
    if (updateStoreDto.state !== undefined) store.state = updateStoreDto.state;
    if (updateStoreDto.country !== undefined) store.country = updateStoreDto.country;
    if (updateStoreDto.hours !== undefined) store.hours = updateStoreDto.hours;
    if (updateStoreDto.contact !== undefined) store.contact = updateStoreDto.contact;
    if (updateStoreDto.isActive !== undefined) store.isActive = updateStoreDto.isActive;

    if (updateStoreDto.mapUrl !== undefined || updateStoreDto.address !== undefined) {
      const fallbackAddress = `${store.address}, ${store.city}, ${store.state}, ${store.country}`;
      store.mapUrl = this.parseMapUrl(updateStoreDto.mapUrl || store.mapUrl, fallbackAddress);
    }

    return this.storeRepository.save(store);
  }

  async remove(id: string): Promise<{ message: string }> {
    const store = await this.findOne(id);
    await this.storeRepository.remove(store);
    return { message: `Store '${store.name}' (${store.code}) removed successfully.` };
  }

  /**
   * Parse user map input (iframe HTML, share URL, embed URL, or location text)
   * into a standardized embeddable Google Maps URL.
   */
  public parseMapUrl(input?: string, fallbackLocation?: string): string {
    const text = input ? input.trim() : '';

    // 1. If user pasted an iframe embed code: <iframe src="https://..."></iframe>
    if (text.includes('<iframe')) {
      const match = text.match(/src=["']([^"']+)["']/i);
      if (match && match[1]) {
        let src = match[1];
        if (src.startsWith('//')) src = `https:${src}`;
        return src;
      }
    }

    // 2. If already an embeddable Google Maps URL
    if (text.startsWith('http')) {
      if (text.includes('google.com/maps/embed') || text.includes('output=embed')) {
        return text;
      }
      // Wrap standard Google Maps share link in embed format
      return `https://maps.google.com/maps?q=${encodeURIComponent(text)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
    }

    // 3. Fallback to geocoding query with address or name
    const query = text || fallbackLocation || 'India';
    return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&t=&z=14&ie=UTF8&iwloc=&output=embed`;
  }

  private async generateStoreCode(): Promise<string> {
    const prefix = 'STR-';
    const latest = await this.storeRepository.findOne({
      where: { code: Like(`${prefix}%`) },
      order: { code: 'DESC' },
    });

    let nextNum = 1;
    if (latest && latest.code) {
      const match = latest.code.match(/(\d+)$/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }

    const padded = String(nextNum).padStart(3, '0');
    return `${prefix}${padded}`;
  }
}

