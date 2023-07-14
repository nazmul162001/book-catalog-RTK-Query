export type IBook = {
  name: string
  author: string
  image: string[]
  discountPercentage?: number
  price: number
  wishList?: string[]
  rating?: number
  quantity: number
  sellCount?: number
  category: 'science' | 'adventure' | 'romance'
  discountTime?: number | string
  status: string
  seller: string
  group?: string
}

export type IBookFilters = {
  searchTerm?: string
  rating?: number
  group?: string
}
export type IPriceFilters = {
  maxPrice?: number
  minPrice?: number
}
