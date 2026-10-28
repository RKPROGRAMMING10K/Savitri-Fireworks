import { apiClient } from '../api/apiClient';
import {
  StoreDto,
  StoreListResponse,
  StoreQueryFilter,
  CreateStoreDto,
  UpdateStoreDto,
} from './dto/store.dto';

export class StoreService {
  /**
   * Fetch paginated & filtered stores
   */
  async getStores(params?: StoreQueryFilter): Promise<StoreListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.search) queryParams.search = params.search;
    if (params?.state && params.state !== 'All') queryParams.state = params.state;
    if (params?.city && params.city !== 'All') queryParams.city = params.city;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    return apiClient.get<StoreListResponse>('/stores', {
      params: queryParams,
    });
  }

  /**
   * Fetch single store by ID or code
   */
  async getStoreById(idOrCode: string): Promise<StoreDto> {
    return apiClient.get<StoreDto>(`/stores/${idOrCode}`);
  }

  /**
   * Create a new store
   */
  async createStore(dto: CreateStoreDto): Promise<StoreDto> {
    return apiClient.post<StoreDto>('/stores', dto);
  }

  /**
   * Update an existing store
   */
  async updateStore(id: string, dto: UpdateStoreDto): Promise<StoreDto> {
    return apiClient.put<StoreDto>(`/stores/${id}`, dto);
  }

  /**
   * Delete a store
   */
  async deleteStore(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/stores/${id}`);
  }
}

export const storeService = new StoreService();

