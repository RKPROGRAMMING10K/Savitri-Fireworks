import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Media } from '../entities/media.entity';
import { CreateMediaDto } from '../dto/create-media.dto';
import { UpdateMediaDto } from '../dto/update-media.dto';
import { MediaQueryDto } from '../dto/media-query.dto';
import { MinioService } from '../../storage/services/minio.service';

@Injectable()
export class MediaService {
  private readonly logger = new Logger(MediaService.name);

  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    private readonly minioService: MinioService,
  ) {}

  async findAll(query: MediaQueryDto = {}) {
    const { type, search, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.mediaRepository
      .createQueryBuilder('media')
      .where('media.isActive = :isActive', { isActive: true })
      .orderBy('media.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (type && type !== 'All') {
      queryBuilder.andWhere('media.type = :type', { type });
    }

    if (search && search.trim()) {
      const s = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(media.title ILIKE :search OR media.shortDesc ILIKE :search OR array_to_string(media.tags, \',\') ILIKE :search)',
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

  async findOne(id: string): Promise<Media> {
    const media = await this.mediaRepository.findOne({ where: { id } });
    if (!media) {
      throw new NotFoundException(`Media item with ID '${id}' not found.`);
    }
    return media;
  }

  async create(createMediaDto: CreateMediaDto, file?: Express.Multer.File): Promise<Media> {
    let mediaUrl = createMediaDto.url || '';
    let mimeType = file ? file.mimetype : null;
    let fileSize = file ? file.size : null;

    if (file) {
      mediaUrl = await this.minioService.uploadFile(file, 'media');
    }

    if (!mediaUrl) {
      throw new BadRequestException('A media file upload or valid direct media URL is required.');
    }

    const tagsArray = this.parseTags(createMediaDto.tags);

    const media = this.mediaRepository.create({
      type: createMediaDto.type,
      title: createMediaDto.title,
      shortDesc: createMediaDto.shortDesc,
      url: mediaUrl,
      thumbnailUrl: createMediaDto.thumbnailUrl || null,
      tags: tagsArray,
      videoPlatform: createMediaDto.videoPlatform || null,
      mimeType,
      fileSize,
    });

    return this.mediaRepository.save(media);
  }

  async update(
    id: string,
    updateMediaDto: UpdateMediaDto,
    file?: Express.Multer.File,
  ): Promise<Media> {
    const media = await this.findOne(id);

    if (file) {
      if (media.url) {
        await this.minioService.deleteFile(media.url);
      }
      media.url = await this.minioService.uploadFile(file, 'media');
      media.mimeType = file.mimetype;
      media.fileSize = file.size;
    } else if (updateMediaDto.url !== undefined) {
      media.url = updateMediaDto.url;
    }

    if (updateMediaDto.type !== undefined) media.type = updateMediaDto.type;
    if (updateMediaDto.title !== undefined) media.title = updateMediaDto.title;
    if (updateMediaDto.shortDesc !== undefined) media.shortDesc = updateMediaDto.shortDesc;
    if (updateMediaDto.videoPlatform !== undefined) media.videoPlatform = updateMediaDto.videoPlatform;
    if (updateMediaDto.thumbnailUrl !== undefined) media.thumbnailUrl = updateMediaDto.thumbnailUrl;
    if (updateMediaDto.tags !== undefined) {
      media.tags = this.parseTags(updateMediaDto.tags);
    }

    return this.mediaRepository.save(media);
  }

  async remove(id: string): Promise<{ message: string }> {
    const media = await this.findOne(id);
    if (media.url) {
      await this.minioService.deleteFile(media.url);
    }
    await this.mediaRepository.remove(media);
    return { message: `Media '${media.title}' removed successfully.` };
  }

  private parseTags(tags: any): string[] {
    if (!tags) return [];
    if (Array.isArray(tags)) {
      return tags.map((t) => String(t).trim()).filter(Boolean);
    }
    if (typeof tags === 'string') {
      return tags
        .split(',')
        .map((t) => t.trim().replace(/^#/, ''))
        .filter(Boolean);
    }
    return [];
  }
}

