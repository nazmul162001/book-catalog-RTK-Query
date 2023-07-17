import { Request, RequestHandler, Response } from 'express';
import catchAsync from '../../../shared/catchAsync';
import sendResponse from '../../../shared/sendResponse';
import httpStatus from 'http-status';
import pick from '../../../shared/pick';
import { WishListService } from './WishList.service';
import { Secret } from 'jsonwebtoken';
import ApiError from '../../../errors/ApiError';
import { jwtHelpers } from '../../../helpers/jwtHelper';
import config from '../../../config/config';
import { wishListFilterableFields } from '../../../constants/pagination';

// create WishList
const createWishList: RequestHandler = catchAsync(
  async (req: Request, res: Response) => {
    const { ...wishList } = req.body;
    const token = req.headers.authorization;
    // console.log('token', token);

    let verifiedToken = null;

    try {
      verifiedToken = jwtHelpers.verifyToken(
        token as string,
        config.jwt.secret as Secret,
      );
    } catch (err) {
      throw new ApiError(httpStatus.FORBIDDEN, 'Invalid Refresh Token');
    }

    // console.log('verifiedToken =======', verifiedToken);

    const { userEmail } = verifiedToken;
    // console.log('Email 📩', userEmail);
    

    const result = await WishListService.createWishList(
      { ...wishList, userEmail },
      userEmail,
    );

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: 'WishList created successfully',
      data: result,
    });
  },
);

//* get all wishList
const getAllWishList = catchAsync(async (req: Request, res: Response) => {
  const result = await WishListService.getAllWishList();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'WishList retrieved successfully',
    data: result.data,
  });
});

export const wishListController = {
  createWishList,
  getAllWishList,
};
