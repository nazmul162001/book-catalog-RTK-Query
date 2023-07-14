import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { IBook, IBookFilters, IPriceFilters } from './book.interface'
import { IPaginationOptions } from '../../../interfaces/paginations'
import { IGenericResponse } from '../../../interfaces/common'
import { paginationHelper } from '../../../helpers/paginationHelper'
import { SortOrder } from 'mongoose'
import { bookSearchableFields } from './book.constant'
import { jwtHelpers } from '../../../helpers/jwtHelper'
import config from '../../../config/config'
import { Secret } from 'jsonwebtoken'
import { User } from '../user/user.model'
import Book from './book.model'

const createNewBook = async (
  payload: IBook,
  userPhoneNumber: string,
  role: string
): Promise<IBook> => {
  try {
    const existingBook = await Book.findOne(payload)

    if (existingBook) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Book already exists')
    }

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
  paginationOptions: IPaginationOptions,
  priceQuery: IPriceFilters
): Promise<IGenericResponse<IBook[]>> => {
  const { searchTerm, rating, group, ...filtersData } = filters
  // shortCut way
  const andConditions = []

  // price filter
  if (priceQuery.minPrice !== undefined && priceQuery.maxPrice !== undefined) {
    const minPrice = Number(priceQuery.minPrice)
    const maxPrice = Number(priceQuery.maxPrice)

    if (!isNaN(minPrice) && !isNaN(maxPrice)) {
      andConditions.push({
        price: {
          $gte: minPrice,
          $lte: maxPrice,
        },
      })
    }
  } else if (priceQuery.minPrice !== undefined) {
    const minPrice = Number(priceQuery.minPrice)

    if (!isNaN(minPrice)) {
      andConditions.push({
        price: { $gte: minPrice },
      })
    }
  } else if (priceQuery.maxPrice !== undefined) {
    const maxPrice = Number(priceQuery.maxPrice)

    if (!isNaN(maxPrice)) {
      andConditions.push({
        price: { $lte: maxPrice },
      })
    }
  }
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

  // rating filter
  if (rating !== undefined) {
    const maxRating = Number(rating)

    if (!isNaN(maxRating)) {
      andConditions.push({
        rating: { $lte: maxRating },
      })
    }
  }

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

  //! Same filter in a Normal way
  // const andConditions = [
  //   {
  //     $or: [
  //       {
  //         location: {
  //           $regex: searchTerm,
  //           $options: 'i',
  //         },
  //       },
  //       {
  //         breed: {
  //           $regex: searchTerm,
  //           $options: 'i',
  //         },
  //       },
  //       {
  //         category: {
  //           $regex: searchTerm,
  //           $options: 'i',
  //         },
  //       },
  //     ],
  //   },
  // ]

  // Handle the "group" filter if provided
  if (filters.group) {
    andConditions.push({
      group: filters.group,
    })
  }

  const { page, limit, skip, sortBy, sortOrder } =
    paginationHelper.calculatePagination(paginationOptions)

  const sortConditions: { [key: string]: SortOrder } = {}

  if (sortBy && sortOrder) {
    sortConditions[sortBy] = sortOrder
  }

  let whereConditions: any =
    andConditions.length > 0 ? { $and: andConditions } : {}

  const result = await Book.find(whereConditions)
    .sort(sortConditions)
    .skip(skip)
    .limit(limit)

  const total = await Book.countDocuments()

  return {
    meta: {
      page,
      limit,
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
    const { userPhoneNumber, role } = verifiedToken

    // Find the book document by id
    const book = await Book.findById(id)

    if (!book) {
      throw new Error('Book not found')
    }

    // Find the corresponding seller document in the User collection
    const seller = await User.findOne({ _id: book.seller })

    if (!seller) {
      throw new Error('Seller not found')
    }

    // Check if the seller's phoneNumber matches the userPhoneNumber
    if (seller.phoneNumber !== userPhoneNumber) {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not Authorized to delete this Book'
      )
    }
    // Check if the user role is "seller"
    if (role !== 'seller') {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not authorized to delete the book'
      )
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
    const { userPhoneNumber, role } = verifiedToken

    // Find the book document by id
    const book = await Book.findById(id)

    if (!book) {
      throw new Error('Book not found')
    }

    // Find the corresponding seller document in the User collection
    const seller = await User.findOne({ _id: book.seller })

    if (!seller) {
      throw new Error('Seller not found')
    }

    // Check if the seller's phoneNumber matches the userPhoneNumber
    if (seller.phoneNumber !== userPhoneNumber) {
      throw new ApiError(httpStatus.FORBIDDEN, 'You are not a seller')
    }
    // Check if the user role is "seller"
    if (role !== 'seller') {
      throw new ApiError(
        httpStatus.FORBIDDEN,
        'You are not authorized to update the book'
      )
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
