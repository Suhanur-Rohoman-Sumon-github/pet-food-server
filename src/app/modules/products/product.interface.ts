

export interface IProductFilterRequest {
  searchTerm?: string;
  category?: string; // Example of additional filters
}

// Assume IPaginationOptions is defined as:
export interface IPaginationOptions {
  page: number;
  limit: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}