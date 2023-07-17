import mongoose from 'mongoose'
import { IWishList, IWishListFilter } from './wishList.interface'
import { WishList } from './wishList.model'
import ApiError from '../../../errors/ApiError'
import httpStatus from 'http-status'
import { IBook } from '../book/book.interface'

const createWishList = async (
  wishList: IWishList,
  userEmail: string
): Promise<IWishList | IBook | null> => {
  let newWishListData = null

  // Check if the wishlist already exists
  const existingWishList = await WishList.findOne({
    bookId: wishList.bookId,
    userEmail: userEmail,
  })

  if (existingWishList) {
    if (existingWishList.status === wishList.status) {
      // Delete the wishlist if the status matches
      await WishList.findByIdAndRemove(existingWishList._id)

      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Wishlist for this book has been deleted'
      )
    } else {
      // Update the status if it does not match
      await WishList.findByIdAndUpdate(existingWishList._id, {
        status: wishList.status,
      })

      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Wishlist for this book already exists. Status updated'
      )
    }
  }
  // Start the transaction
  const session = await mongoose.startSession()
  // console.log(userEmail);
  try {
    session.startTransaction()

    const newWishList = await WishList.create([wishList], { session })

    if (!newWishList.length) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        'Failed to create this WishList'
      )
    }

    newWishListData = newWishList[0]

    await session.commitTransaction()
    await session.endSession()
  } catch (error) {
    await session.abortTransaction()
    await session.endSession()
    throw error
  }

  return newWishListData
}

//* Get all wishList
const getAllWishList = async () => {
  const result = await WishList.find().populate('bookId')
  return {
    data: result,
  }
}

export const WishListService = {
  createWishList,
  getAllWishList,
}
