import { CategoryDto } from '../../categories/dto/category.dto';

export interface ProductDto {
  id: string;
  name: string;
  code: string;
  categoryId: string;
  category: CategoryDto;
  shortDesc: string;
  description: string;
  image: string;
  tag?: string | null;
  rating: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductListResponse {
  items: ProductDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductQueryFilter {
  search?: string;
  category?: string;
  page?: number;
  limit?: number;
}

export interface CreateProductDto {
  name: string;
  categoryId: string;
  shortDesc: string;
  description: string;
  tag?: string;
  rating?: number;
  image?: string;
}

export interface UpdateProductDto {
  name?: string;
  categoryId?: string;
  shortDesc?: string;
  description?: string;
  tag?: string;
  rating?: number;
  image?: string;
}

