import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IBook } from './book.interface'
import ApiError from '../../../errors/ApiError'
import pick from '../../../shared/pick'
import { paginationFields } from '../../../constants/pagination'
import { bookFilterableField } from './book.constant'
import { jwtHelpers } from '../../../helpers/jwtHelper'
import config from '../../../config/config'
import { Secret } from 'jsonwebtoken'
import { bookService } from './book.service'
import Book from './book.model'
const { ObjectId } = require('mongodb');
// create a new book
const createBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...bookData } = req.body
    const token = req.headers.authorization
    let verifiedToken = null
    verifiedToken = jwtHelpers.verifyToken(
      token as string,
      config.jwt.secret as Secret
    )
    const { userEmail } = verifiedToken

    const result = await bookService.createNewBook(
      { ...bookData, userEmail }, // Add userEmail to the bookData object
      userEmail
    )

    sendResponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book created successfully!',
      data: result,
    })
  }
)


// get all books
const getAllBooks: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const filters = pick(req.query, bookFilterableField)
    const paginationOptions = pick(req.query, paginationFields)

    const result = await bookService.getAllBooks(
      filters,
      paginationOptions,
    )

    sendResponse<IBook[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All books retrieved successfully!',
      meta: result.meta,
      data: result.data,
    })
  }
)

// get single book
const getSingleBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const book = await bookService.getSingleBook(id)

    if (!book) {
      throw new ApiError(httpStatus.NOT_FOUND, 'Book not found')
    }

    sendResponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book retrieved successfully!',
      data: book,
    })
  }
)

// delete book
const deleteBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const token = req.headers.authorization
    await bookService.deleteBook(id, token as string)

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'Book deleted successfully!',
    })
  }
)

// update book
const updateBook: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const id = req.params.id
    const updateData = req.body
    const token = req.headers.authorization
    const updatedBook = await bookService.updateBook(
      id,
      updateData,
      token as string
    )

    if (!updatedBook) {
      throw new ApiError(httpStatus.NOT_FOUND, 'User not found')
    }

    sendResponse<IBook>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User updated successfully!',
      data: updatedBook,
    })
  }
)

 //* Add reviews
 const addReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  const addReview = req.body.reviews;
  const result = await Book.updateOne(
    { _id: id },
    { $push: { reviews: addReview } },
  );

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Add Review successfully',
    data: result,
  });
});

//* get reviews
const getAllReview = catchAsync(async (req: Request, res: Response) => {
  const id = req.params.id;
  console.log(id);

  const result = await Book.findOne({ _id: id }).select({ reviews: 1, _id: 0 });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'get all Review successfully',
    data: result,
  });
}); 

export const BookController = {
  createBook,
  getAllBooks,
  getSingleBook,
  deleteBook,
  updateBook,
  getAllReview,
  addReview
}
