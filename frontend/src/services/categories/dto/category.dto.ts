export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  codePrefix?: string;
  description?: string;
  displayOrder: number;
  isActive: boolean;
  parentId?: string | null;
  parent?: CategoryDto | null;
  children?: CategoryDto[];
}

export interface CreateCategoryDto {
  name: string;
  slug?: string;
  codePrefix?: string;
  description?: string;
  parentId?: string | null;
  displayOrder?: number;
}

export interface UpdateCategoryDto {
  name?: string;
  slug?: string;
  codePrefix?: string;
  description?: string;
  parentId?: string | null;
  displayOrder?: number;
}

