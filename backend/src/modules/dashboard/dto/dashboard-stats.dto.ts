export interface DashboardMonthlyStat {
  name: string;
  key: string;
  dealer: number;
  customer: number;
  total: number;
}

export interface DashboardRecentEnquiry {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  subject: string;
  status: string;
  createdAt: Date;
}

export interface DashboardStatsResponseDto {
  totalEnquiries: number;
  pendingEnquiries: number;
  contactedEnquiries: number;
  resolvedEnquiries: number;
  totalProducts: number;
  totalCategories: number;
  totalStores: number;
  totalMedia: number;
  monthlyStats: DashboardMonthlyStat[];
  recentEnquiries: DashboardRecentEnquiry[];
  systemUptime: string;
  databaseStatus: string;
}

