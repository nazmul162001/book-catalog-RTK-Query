import { NextFunction, Request, Response } from 'express'
import { Secret } from 'jsonwebtoken'
import ApiError from '../../errors/ApiError'
import { jwtHelpers } from '../../helpers/jwtHelper'
import config from '../../config/config'
import httpStatus from 'http-status'

const auth =
  (...requiredRoles: string[]) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      //get authorization token
      const token = req.headers.authorization
      if (!token) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'You are not authorized')
      }
      // verify token
      let verifiedUser = null

      verifiedUser = jwtHelpers.verifyToken(token, config.jwt.secret as Secret)

      req.user = verifiedUser // role , userNumber

      // guard using roles
      if (requiredRoles.length && !requiredRoles.includes(verifiedUser.role)) {
        throw new ApiError(httpStatus.FORBIDDEN, "You don't have permission")
      }
      next()
    } catch (error) {
      next(error)
    }
  }

export default auth
