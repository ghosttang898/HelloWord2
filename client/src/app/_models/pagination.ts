export interface Pagination {
  currentPage: number;
  itemsPages: number;
  totalItems: number;
  totalPages: number;
}

export class PaginatedResult<T>{
  result: T;
  pagination: Pagination;
}
