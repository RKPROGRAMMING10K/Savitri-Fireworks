export interface StoreDto {
  id: string;
  code: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  hours: string;
  contact: string;
  mapUrl: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface StoreListResponse {
  items: StoreDto[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface StoreQueryFilter {
  search?: string;
  state?: string;
  city?: string;
  page?: number;
  limit?: number;
}

export interface CreateStoreDto {
  name: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  hours?: string;
  contact?: string;
  mapUrl?: string;
}

export interface UpdateStoreDto {
  name?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  hours?: string;
  contact?: string;
  mapUrl?: string;
  isActive?: boolean;
}

