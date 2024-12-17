export interface IProductFilterRequest {
  searchTerm?: string
  category?: string
  minPrice?: string
  maxPrice?: string
  sort?: string
}

export interface IPaginationOptions {
  page: number
  limit: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface CardItem {
  productId: string
  quantity: number
}
