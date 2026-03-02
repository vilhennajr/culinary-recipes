/**
 * Shared pagination interfaces used across all domain repositories.
 * Centralised here to avoid duplication between user / category / recipe repositories.
 */
export interface PaginationParams {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
