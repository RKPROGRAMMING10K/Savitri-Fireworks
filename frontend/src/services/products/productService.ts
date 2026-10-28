import { apiClient } from '../api/apiClient';
import {
  ProductDto,
  ProductListResponse,
  ProductQueryFilter,
} from './dto/product.dto';

export class ProductService {
  /**
   * Fetch paginated & filtered products
   */
  async getProducts(params?: ProductQueryFilter): Promise<ProductListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.search) queryParams.search = params.search;
    if (params?.category && params.category !== 'All') queryParams.category = params.category;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    return apiClient.get<ProductListResponse>('/products', {
      params: queryParams,
    });
  }

  /**
   * Fetch single product by ID
   */
  async getProductById(id: string): Promise<ProductDto> {
    return apiClient.get<ProductDto>(`/products/${id}`);
  }

  /**
   * Create a new product with optional multipart image upload
   */
  async createProduct(data: FormData): Promise<ProductDto> {
    return apiClient.post<ProductDto>('/products', data);
  }

  /**
   * Update an existing product
   */
  async updateProduct(id: string, data: FormData): Promise<ProductDto> {
    return apiClient.put<ProductDto>(`/products/${id}`, data);
  }

  /**
   * Delete a product
   */
  async deleteProduct(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/products/${id}`);
  }
}

export const productService = new ProductService();

