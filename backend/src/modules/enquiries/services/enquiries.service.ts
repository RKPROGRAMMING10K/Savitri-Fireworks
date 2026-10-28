import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Enquiry, EnquiryStatus } from '../entities/enquiry.entity';
import { CreateEnquiryDto } from '../dto/create-enquiry.dto';
import { ReplyEnquiryDto } from '../dto/reply-enquiry.dto';
import { EnquiryQueryDto } from '../dto/enquiry-query.dto';
import { MinioService } from '../../storage/services/minio.service';

@Injectable()
export class EnquiriesService {
  private readonly logger = new Logger(EnquiriesService.name);

  constructor(
    @InjectRepository(Enquiry)
    private readonly enquiryRepository: Repository<Enquiry>,
    private readonly minioService: MinioService,
  ) {}

  async findAll(query: EnquiryQueryDto = {}) {
    const { status, search, enquiryType, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.enquiryRepository
      .createQueryBuilder('enquiry')
      .orderBy('enquiry.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (status && status !== 'All') {
      queryBuilder.andWhere('enquiry.status = :status', { status });
    }

    if (enquiryType && enquiryType !== 'All') {
      queryBuilder.andWhere('enquiry.enquiryType = :enquiryType', { enquiryType });
    }

    if (search && search.trim()) {
      const s = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(enquiry.name ILIKE :search OR enquiry.email ILIKE :search OR enquiry.code ILIKE :search OR enquiry.phone ILIKE :search OR enquiry.subject ILIKE :search OR enquiry.message ILIKE :search)',
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

  async findOne(id: string): Promise<Enquiry> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    const enquiry = await this.enquiryRepository.findOne({
      where: isUuid ? { id } : { code: id },
    });

    if (!enquiry) {
      throw new NotFoundException(`Enquiry with ID or code '${id}' not found.`);
    }

    return enquiry;
  }

  async create(createEnquiryDto: CreateEnquiryDto, file?: Express.Multer.File): Promise<Enquiry> {
    const code = await this.generateEnquiryCode();

    let attachmentUrl: string | null = null;
    let hasAttachments = false;

    if (file) {
      attachmentUrl = await this.minioService.uploadFile(file, 'enquiries');
      hasAttachments = true;
    }

    const enquiry = this.enquiryRepository.create({
      code,
      name: createEnquiryDto.name,
      email: createEnquiryDto.email,
      phone: createEnquiryDto.phone,
      enquiryType: createEnquiryDto.enquiryType,
      subject: createEnquiryDto.subject,
      message: createEnquiryDto.message,
      companyName: createEnquiryDto.companyName || null,
      productName: createEnquiryDto.productName || null,
      dealerName: createEnquiryDto.dealerName || null,
      pesoLicense: createEnquiryDto.pesoLicense || null,
      status: EnquiryStatus.PENDING,
      hasAttachments,
      attachmentUrl,
      replies: [],
    });

    return this.enquiryRepository.save(enquiry);
  }

  async updateStatus(id: string, status: string): Promise<Enquiry> {
    const enquiry = await this.findOne(id);
    enquiry.status = status;
    return this.enquiryRepository.save(enquiry);
  }

  async addReply(
    id: string,
    replyDto: ReplyEnquiryDto,
    sender: string = 'Savitri Support',
  ): Promise<Enquiry> {
    const enquiry = await this.findOne(id);

    const timeString = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateString = `Today, ${timeString}`;

    const newReply = {
      id: `rep-${Date.now()}`,
      message: replyDto.message,
      date: dateString,
      sender,
    };

    const currentReplies = Array.isArray(enquiry.replies) ? enquiry.replies : [];
    enquiry.replies = [...currentReplies, newReply];
    enquiry.status = EnquiryStatus.CONTACTED;

    return this.enquiryRepository.save(enquiry);
  }

  async remove(id: string): Promise<{ message: string }> {
    const enquiry = await this.findOne(id);
    if (enquiry.attachmentUrl) {
      await this.minioService.deleteFile(enquiry.attachmentUrl);
    }
    await this.enquiryRepository.remove(enquiry);
    return { message: `Enquiry '${enquiry.code}' removed successfully.` };
  }

  private async generateEnquiryCode(): Promise<string> {
    const prefix = 'ENQ-';
    const latest = await this.enquiryRepository.findOne({
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

