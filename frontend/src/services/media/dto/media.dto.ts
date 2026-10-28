export interface MediaDto {
  id: string;
  type: 'Photo' | 'Video';
  title: string;
  shortDesc: string;
  url: string;
  thumbnailUrl?: string | null;
  tags: string[];
  videoPlatform?: string | null;
  mimeType?: string | null;
  fileSize?: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface MediaListResponse {
  items: MediaDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface MediaQueryFilter {
  type?: 'Photo' | 'Video' | 'All';
  search?: string;
  page?: number;
  limit?: number;
}

export interface CreateMediaDto {
  type: 'Photo' | 'Video';
  title: string;
  shortDesc: string;
  tags?: string;
  videoPlatform?: string;
  url?: string;
  thumbnailUrl?: string;
}

export interface UpdateMediaDto {
  type?: 'Photo' | 'Video';
  title?: string;
  shortDesc?: string;
  tags?: string;
  videoPlatform?: string;
  url?: string;
  thumbnailUrl?: string;
}

