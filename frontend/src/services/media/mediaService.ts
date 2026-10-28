import { apiClient } from '../api/apiClient';
import {
  MediaDto,
  MediaListResponse,
  MediaQueryFilter,
} from './dto/media.dto';

export class MediaService {
  /**
   * Fetch paginated & filtered media items
   */
  async getMedia(params?: MediaQueryFilter): Promise<MediaListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.type && params.type !== 'All') queryParams.type = params.type;
    if (params?.search) queryParams.search = params.search;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    return apiClient.get<MediaListResponse>('/media', {
      params: queryParams,
    });
  }

  /**
   * Fetch single media item by ID
   */
  async getMediaById(id: string): Promise<MediaDto> {
    return apiClient.get<MediaDto>(`/media/${id}`);
  }

  /**
   * Create a new media item with optional multipart file upload (image or direct video)
   */
  async createMedia(data: FormData): Promise<MediaDto> {
    return apiClient.post<MediaDto>('/media', data);
  }

  /**
   * Update an existing media item
   */
  async updateMedia(id: string, data: FormData): Promise<MediaDto> {
    return apiClient.put<MediaDto>(`/media/${id}`, data);
  }

  /**
   * Delete a media item
   */
  async deleteMedia(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/media/${id}`);
  }
}

export const mediaService = new MediaService();

