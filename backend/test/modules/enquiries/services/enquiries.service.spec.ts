import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { EnquiriesService } from '../../../../src/modules/enquiries/services/enquiries.service';
import { Enquiry } from '../../../../src/modules/enquiries/entities/enquiry.entity';
import { MinioService } from '../../../../src/modules/storage/services/minio.service';

describe('EnquiriesService', () => {
  let service: EnquiriesService;
  let enquiryRepo: any;
  let minioService: any;

  beforeEach(async () => {
    enquiryRepo = {
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
      save: jest.fn((entity) => Promise.resolve({ id: 'enq-uuid-1', ...entity })),
      remove: jest.fn(),
    };

    minioService = {
      uploadFile: jest.fn().mockResolvedValue('http://localhost:9000/savitri-uploads/enquiries/doc.pdf'),
      deleteFile: jest.fn().mockResolvedValue(undefined),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnquiriesService,
        {
          provide: getRepositoryToken(Enquiry),
          useValue: enquiryRepo,
        },
        {
          provide: MinioService,
          useValue: minioService,
        },
      ],
    }).compile();

    service = module.get<EnquiriesService>(EnquiriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an enquiry with auto-generated code ENQ-001', async () => {
    enquiryRepo.findOne.mockResolvedValue(null);

    const dto = {
      name: 'Rohit Sharma',
      email: 'rohit@example.com',
      phone: '+91 98765 43210',
      enquiryType: 'Wholesale Dealership',
      subject: 'Dealership Request',
      message: 'Looking to purchase fireworks in bulk',
    };

    const created = await service.create(dto);
    expect(created.code).toBe('ENQ-001');
    expect(created.status).toBe('Pending');
    expect(created.hasAttachments).toBe(false);
    expect(enquiryRepo.save).toHaveBeenCalled();
  });

  it('should add reply and auto-set status to Contacted', async () => {
    const mockEnquiry = {
      id: 'enq-uuid-1',
      code: 'ENQ-001',
      email: 'rohit@example.com',
      status: 'Pending',
      replies: [],
    };
    enquiryRepo.findOne.mockResolvedValue(mockEnquiry);

    const updated = await service.addReply('enq-uuid-1', { message: 'We have received your request.' });
    expect(updated.status).toBe('Contacted');
    expect(updated.replies.length).toBe(1);
    expect(updated.replies[0].message).toBe('We have received your request.');
    expect(enquiryRepo.save).toHaveBeenCalled();
  });
});

