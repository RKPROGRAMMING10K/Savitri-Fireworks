import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(flat: boolean = false): Promise<Category[]> {
    if (flat) {
      return this.categoryRepository.find({
        order: { displayOrder: 'ASC', name: 'ASC' },
        relations: ['parent'],
      });
    }

    // Return root categories with their children
    return this.categoryRepository.find({
      where: { parentId: IsNull() },
      order: { displayOrder: 'ASC', name: 'ASC' },
      relations: ['children'],
    });
  }

  async findOne(idOrSlug: string): Promise<Category> {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
    const category = await this.categoryRepository.findOne({
      where: isUuid ? { id: idOrSlug } : { slug: idOrSlug },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID or slug '${idOrSlug}' not found.`);
    }

    return category;
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    const slug = createCategoryDto.slug || this.generateSlug(createCategoryDto.name);

    const existing = await this.categoryRepository.findOne({ where: { slug } });
    if (existing) {
      throw new ConflictException(`Category with slug '${slug}' already exists.`);
    }

    let parent: Category | null = null;
    if (createCategoryDto.parentId) {
      parent = await this.categoryRepository.findOne({
        where: { id: createCategoryDto.parentId },
      });
      if (!parent) {
        throw new NotFoundException(`Parent category '${createCategoryDto.parentId}' not found.`);
      }
    }

    const codePrefix = createCategoryDto.codePrefix || this.generatePrefix(createCategoryDto.name);

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      slug,
      codePrefix,
      parent,
    });

    return this.categoryRepository.save(category);
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
    const category = await this.findOne(id);

    if (updateCategoryDto.name && !updateCategoryDto.slug) {
      category.slug = this.generateSlug(updateCategoryDto.name);
    } else if (updateCategoryDto.slug) {
      category.slug = updateCategoryDto.slug;
    }

    if (updateCategoryDto.parentId !== undefined) {
      if (updateCategoryDto.parentId === null) {
        category.parentId = null;
        category.parent = null;
      } else {
        const parent = await this.categoryRepository.findOne({
          where: { id: updateCategoryDto.parentId },
        });
        if (!parent) {
          throw new NotFoundException(`Parent category '${updateCategoryDto.parentId}' not found.`);
        }
        category.parentId = parent.id;
        category.parent = parent;
      }
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<{ message: string }> {
    const category = await this.findOne(id);
    await this.categoryRepository.remove(category);
    return { message: `Category '${category.name}' removed successfully.` };
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  private generatePrefix(name: string): string {
    const words = name.trim().split(/\s+/);
    if (words.length >= 3) {
      return (words[0][0] + words[1][0] + words[2][0]).toUpperCase();
    }
    return name.substring(0, 3).toUpperCase();
  }
}
