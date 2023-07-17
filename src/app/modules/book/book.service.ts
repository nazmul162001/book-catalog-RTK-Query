import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { IBook, IBookFilters } from './book.interface'
import { IPaginationOptions } from '../../../interfaces/paginations'
import { IGenericResponse } from '../../../interfaces/common'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { SortOrder } from 'mongoose'
import { bookSearchableFields } from './book.constant'
import { jwtHelpers } from '../../../helpers/jwtHelper'
import config from '../../../config/config'
import { Secret } from 'jsonwebtoken'
import Book from './book.model'

const createNewBook = async (
  payload: IBook,
  userEmail: string
): Promise<IBook> => {
  try {
    const existingBook = await Book.findOne(payload)

    if (existingBook) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Book already exists')
    }

    // const bookData = Object.assign({}, payload, { userEmail }) // Add userEmail to the payload

    const createdBook = await Book.create(payload)
    if (!createdBook) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Failed to create book')
    }

    return createdBook
  } catch (error) {
    throw error
  }
}

// get allCows

const getAllBooks = async (
  filters: IBookFilters,
  paginationOptions: IPaginationOptions
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, ...filtersData } = filters
  // shortCut way
  const andConditions = []

  // search term
  if (searchTerm)
    andConditions.push({
      $or: bookSearchableFields.map((field) => ({
        [field]: {
          $regex: searchTerm,
          $options: 'i',
        },
      })),
    })

  // exact filter
  if (Object.keys(filtersData).length) {
    andConditions.push({
      $and: Object.entries(filtersData).map(([field, value]) => ({
        [field]: {
          $regex: new RegExp(`\\b${value}\\b`, 'i'),
        },
      })),
    })
  }

  const { page, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions)

  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  let whereConditions: any =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const result = await Book.find(whereConditions)
    .sort(sortConditions)

  const total = await Book.countDocuments()

  return {
    meta: {
      page,
      total,
    },
    data: result,
  }
}

const getSingleBook = async (id: string): Promise<IBook | null> => {
  try {
    const book = await Book.findById(id)
    return book
  } catch (error) {
    throw error
  }
}
// delete book
const deleteBook = async (id: string, token: string): Promise<void> => {
  let verifiedToken = null
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token as string,
      config.jwt.secret as Secret
    )
    const { userEmail } = verifiedToken

    // Find the book document by id
    const book = await Book.findById(id)

    if (!book) {
      throw new Error('Book not found')
    }

    // Compare the userEmail from the token with the userEmail in the book data
    if (book.userEmail !== userEmail) {
      throw new Error("You can't delete this book")
    }

    const bookData = await Book.findByIdAndDelete(id)
    if (!bookData) {
      throw new Error('Book not found')
    }
  } catch (error) {
    throw error
  }
}
// update book
const updateBook = async (
  id: string,
  payload: Partial<IBook>,
  token: string
): Promise<IBook | null> => {
  let verifiedToken = null
  try {
    verifiedToken = jwtHelpers.verifyToken(
      token as string,
      config.jwt.secret as Secret
    )
    const { userEmail } = verifiedToken

    // Find the book document by id
    const book = await Book.findById(id)

    if (!book) {
      throw new Error('Book not found')
    }

    // Compare the userEmail from the token with the userEmail in the book data
    if (book.userEmail !== userEmail) {
      throw new Error("You can't update this book")
    }

    const updateBook = await Book.findByIdAndUpdate(id, payload, { new: true })
    return updateBook
  } catch (error) {
    throw new ApiError(httpStatus.FORBIDDEN, 'Invalid refresh token')
  }
}

export const bookService = {
  createNewBook,
  getAllBooks,
  getSingleBook,
  deleteBook,
  updateBook,
}
