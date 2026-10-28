import { apiClient } from '../api/apiClient';
import {
  EnquiryDto,
  EnquiryListResponse,
  EnquiryQueryFilter,
} from './dto/enquiry.dto';

export class EnquiryService {
  /**
   * Fetch paginated & filtered enquiries (Admin)
   */
  async getEnquiries(params?: EnquiryQueryFilter): Promise<EnquiryListResponse> {
    const queryParams: Record<string, string | number | boolean | undefined> = {};

    if (params?.status && params.status !== 'All') queryParams.status = params.status;
    if (params?.search) queryParams.search = params.search;
    if (params?.enquiryType && params.enquiryType !== 'All') queryParams.enquiryType = params.enquiryType;
    if (params?.page) queryParams.page = params.page;
    if (params?.limit) queryParams.limit = params.limit;

    return apiClient.get<EnquiryListResponse>('/enquiries', {
      params: queryParams,
    });
  }

  /**
   * Fetch single enquiry by ID or code
   */
  async getEnquiryById(idOrCode: string): Promise<EnquiryDto> {
    return apiClient.get<EnquiryDto>(`/enquiries/${idOrCode}`);
  }

  /**
   * Create a new enquiry (Public / Customer submission)
   * Supports FormData for optional attachment upload
   */
  async createEnquiry(data: FormData | any): Promise<EnquiryDto> {
    return apiClient.post<EnquiryDto>('/enquiries', data);
  }

  /**
   * Update enquiry status ('Contacted' | 'Resolved')
   */
  async updateStatus(id: string, status: 'Contacted' | 'Resolved'): Promise<EnquiryDto> {
    return apiClient.patch<EnquiryDto>(`/enquiries/${id}/status`, { status });
  }

  /**
   * Add reply message to enquiry thread
   */
  async addReply(id: string, message: string): Promise<EnquiryDto> {
    return apiClient.post<EnquiryDto>(`/enquiries/${id}/reply`, { message });
  }

  /**
   * Delete an enquiry
   */
  async deleteEnquiry(id: string): Promise<{ message: string }> {
    return apiClient.delete<{ message: string }>(`/enquiries/${id}`);
  }
}

export const enquiryService = new EnquiryService();

