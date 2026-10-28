import { apiClient } from '../api/apiClient';
import { CategoryDto, CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

export class CategoryService {
  /**
   * Fetch all categories (tree hierarchical by default, or flat)
   */
  async getCategories(flat: boolean = false): Promise<CategoryDto[]> {
    return apiClient.get<CategoryDto[]>('/categories', {
      params: flat ? { flat: true } : undefined,
    });
  }

  /**
   * Fetch a single category by id or slug
   */
  async getCategoryById(idOrSlug: string): Promise<CategoryDto> {
    return apiClient.get<CategoryDto>(`/categories/${idOrSlug}`);
  }

  /**
   * Create a new category (Admin)
   */
  async createCategory(dto: CreateCategoryDto): Promise<CategoryDto> {
    return apiClient.post<CategoryDto>('/categories', dto);
  }

  /**
   * Update a category (Admin)
   */
  async updateCategory(id: string, dto: UpdateCategoryDto): Promise<CategoryDto> {
    return apiClient.put<CategoryDto>(`/categories/${id}`, dto);
  }

  /**
   * Delete a category (Admin)
   */
  async deleteCategory(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/categories/${id}`);
  }
}

export const categoryService = new CategoryService();

