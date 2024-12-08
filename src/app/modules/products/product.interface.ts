export interface IProductFilterRequest {
  searchTerm?: string
  category?: string 
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
