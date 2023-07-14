import ApiError from '../../../errors/ApiError'
import { IUser } from './user.interface'
import httpStatus from 'http-status'
import { User } from './user.model'

const createNewUser = async (payload: IUser): Promise<IUser> => {
  try {
    // Check duplicate entries
    const existingUser = await User.findOne({
      email: payload.email,
    })
    if (existingUser) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'User already exists')
    }

    const createUser = await User.create(payload)
    return createUser
  } catch (error) {
    throw error
  }
}

export const userService = {
  createNewUser,
}
