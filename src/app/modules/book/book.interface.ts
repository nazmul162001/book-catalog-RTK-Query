export type IBook = {
  title: string
  author: string
  genre: string
  publicationDate: string
  reviews?: string[]
  image?: string
  userEmail?: string
}

export type IBookFilters = {
  searchTerm?: string
}
