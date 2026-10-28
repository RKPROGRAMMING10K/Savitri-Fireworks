export interface EnquiryReplyDto {
  id: string;
  message: string;
  date: string;
  sender: string;
}

export interface EnquiryDto {
  id: string;
  code: string;
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  subject: string;
  message: string;
  status: 'Pending' | 'Contacted' | 'Resolved';
  hasAttachments: boolean;
  attachmentUrl?: string | null;
  companyName?: string | null;
  productName?: string | null;
  dealerName?: string | null;
  pesoLicense?: string | null;
  replies: EnquiryReplyDto[];
  createdAt: string;
  updatedAt: string;
}

export interface EnquiryListResponse {
  items: EnquiryDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface EnquiryQueryFilter {
  status?: string;
  search?: string;
  enquiryType?: string;
  page?: number;
  limit?: number;
}

export interface CreateEnquiryDto {
  name: string;
  email: string;
  phone: string;
  enquiryType: string;
  subject: string;
  message: string;
  companyName?: string;
  productName?: string;
  dealerName?: string;
  pesoLicense?: string;
}

