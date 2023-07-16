import { Request, Response } from 'express'
import { RequestHandler } from 'express-serve-static-core'
import httpStatus from 'http-status'
import catchAsync from '../../../shared/catchAsync'
import sendResponse from '../../../shared/sendResponse'
import { IUser } from './user.interface'
import { userService } from './user.service'

// create a new user
const createUser: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...userData } = req.body
    const result = await userService.createNewUser(userData)

    sendResponse<IUser>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'User created successfully!',
      data: result,
    })
  }
)

// get all users
const getAllUsers: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const users = await userService.getAllUsers()

    sendResponse<IUser[]>(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'All users retrieved successfully!',
      data: users,
    })
  }
)

export const UserController = {
  createUser,
  getAllUsers,
}
