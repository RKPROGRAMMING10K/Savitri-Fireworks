import { apiClient } from '../api/apiClient';
import { DashboardStatsResponse } from './dto/dashboard.dto';

export class DashboardService {
  /**
   * Fetch aggregated live metrics and analytics for the admin control dashboard
   */
  async getStats(): Promise<DashboardStatsResponse> {
    return apiClient.get<DashboardStatsResponse>('/dashboard/stats');
  }
}

export const dashboardService = new DashboardService();

