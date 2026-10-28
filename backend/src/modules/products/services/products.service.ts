import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Category } from '../../categories/entities/category.entity';
import { CreateProductDto } from '../dto/create-product.dto';
import { UpdateProductDto } from '../dto/update-product.dto';
import { ProductQueryDto } from '../dto/product-query.dto';
import { MinioService } from '../../storage/services/minio.service';
import { CategoriesService } from '../../categories/services/categories.service';

@Injectable()
export class ProductsService {
  private readonly logger = new Logger(ProductsService.name);

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    private readonly minioService: MinioService,
    private readonly categoriesService: CategoriesService,
  ) {}

  async findAll(query: ProductQueryDto = {}) {
    const { search, category, page = 1, limit = 50 } = query;
    const skip = (page - 1) * limit;

    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('category.parent', 'parentCategory')
      .orderBy('product.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (search && search.trim()) {
      const s = `%${search.trim()}%`;
      queryBuilder.andWhere(
        '(product.name ILIKE :search OR product.code ILIKE :search OR product.shortDesc ILIKE :search OR category.name ILIKE :search)',
        { search: s },
      );
    }

    if (category && category !== 'All') {
      const matchedCat = await this.categoryRepository.findOne({
        where: [
          { slug: category },
          { name: category },
          ...(this.isUuid(category) ? [{ id: category }] : []),
        ],
        relations: ['children'],
      });

      if (matchedCat) {
        if (matchedCat.children && matchedCat.children.length > 0) {
          const ids = [matchedCat.id, ...matchedCat.children.map((c) => c.id)];
          queryBuilder.andWhere('product.categoryId IN (:...ids)', { ids });
        } else {
          queryBuilder.andWhere('product.categoryId = :catId', { catId: matchedCat.id });
        }
      } else {
        queryBuilder.andWhere('category.name ILIKE :catName', { catName: `%${category}%` });
      }
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

  async findOne(id: string): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category', 'category.parent'],
    });

    if (!product) {
      throw new NotFoundException(`Product with ID '${id}' not found.`);
    }

    return product;
  }

  async create(createProductDto: CreateProductDto, file?: Express.Multer.File): Promise<Product> {
    const category = await this.resolveCategory(createProductDto.categoryId);

    let imageUrl = createProductDto.image || '';
    if (file) {
      imageUrl = await this.minioService.uploadFile(file, 'products');
    }

    const code = await this.generateProductCode(category);

    const product = this.productRepository.create({
      name: createProductDto.name,
      code,
      categoryId: category.id,
      category,
      shortDesc: createProductDto.shortDesc,
      description: createProductDto.description,
      image: imageUrl,
      tag: createProductDto.tag || null,
      rating: createProductDto.rating || 4.8,
    });

    return this.productRepository.save(product);
  }

  async update(
    id: string,
    updateProductDto: UpdateProductDto,
    file?: Express.Multer.File,
  ): Promise<Product> {
    const product = await this.findOne(id);

    if (updateProductDto.categoryId) {
      const category = await this.resolveCategory(updateProductDto.categoryId);
      product.categoryId = category.id;
      product.category = category;
    }

    if (file) {
      if (product.image) {
        await this.minioService.deleteFile(product.image);
      }
      product.image = await this.minioService.uploadFile(file, 'products');
    } else if (updateProductDto.image !== undefined) {
      product.image = updateProductDto.image;
    }

    if (updateProductDto.name !== undefined) product.name = updateProductDto.name;
    if (updateProductDto.shortDesc !== undefined) product.shortDesc = updateProductDto.shortDesc;
    if (updateProductDto.description !== undefined) product.description = updateProductDto.description;
    if (updateProductDto.tag !== undefined) product.tag = updateProductDto.tag;
    if (updateProductDto.rating !== undefined) product.rating = updateProductDto.rating;

    return this.productRepository.save(product);
  }

  async remove(id: string): Promise<{ message: string }> {
    const product = await this.findOne(id);
    if (product.image) {
      await this.minioService.deleteFile(product.image);
    }
    await this.productRepository.remove(product);
    return { message: `Product '${product.name}' removed successfully.` };
  }

  private async resolveCategory(catIdentifier: string): Promise<Category> {
    const isUuid = this.isUuid(catIdentifier);
    const category = await this.categoryRepository.findOne({
      where: isUuid
        ? { id: catIdentifier }
        : [{ slug: catIdentifier }, { name: catIdentifier }],
    });

    if (!category) {
      throw new NotFoundException(`Category '${catIdentifier}' not found.`);
    }

    return category;
  }

  private async generateProductCode(category: Category): Promise<string> {
    const prefix = (category.codePrefix || 'GEN').toUpperCase();
    const prefixPattern = `SF-${prefix}%`;

    const latest = await this.productRepository.findOne({
      where: { code: Like(prefixPattern) },
      order: { code: 'DESC' },
    });

    let nextNum = 1;
    if (latest && latest.code) {
      const match = latest.code.match(/(\d+)$/);
      if (match) {
        nextNum = parseInt(match[1], 10) + 1;
      }
    }

    const paddedNum = String(nextNum).padStart(2, '0');
    return `SF-${prefix}${paddedNum}`;
  }

  private isUuid(val: string): boolean {
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);
  }
}
