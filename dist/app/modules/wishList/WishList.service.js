"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishListService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const wishList_model_1 = require("./wishList.model");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const createWishList = (wishList, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    let newWishListData = null;
    // Check if the wishlist already exists
    const existingWishList = yield wishList_model_1.WishList.findOne({
        bookId: wishList.bookId,
        userEmail: userEmail,
    });
    if (existingWishList) {
        if (existingWishList.status === wishList.status) {
            // Delete the wishlist if the status matches
            yield wishList_model_1.WishList.findByIdAndRemove(existingWishList._id);
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Wishlist for this book has been deleted');
        }
        else {
            // Update the status if it does not match
            yield wishList_model_1.WishList.findByIdAndUpdate(existingWishList._id, {
                status: wishList.status,
            });
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Wishlist for this book already exists. Status updated');
        }
    }
    // Start the transaction
    const session = yield mongoose_1.default.startSession();
    // console.log(userEmail);
    try {
        session.startTransaction();
        const newWishList = yield wishList_model_1.WishList.create([wishList], { session });
        if (!newWishList.length) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create this WishList');
        }
        newWishListData = newWishList[0];
        yield session.commitTransaction();
        yield session.endSession();
    }
    catch (error) {
        yield session.abortTransaction();
        yield session.endSession();
        throw error;
    }
    return newWishListData;
});
//* Get all wishList
const getAllWishList = () => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield wishList_model_1.WishList.find().populate('bookId');
    return {
        data: result,
    };
});
exports.WishListService = {
    createWishList,
    getAllWishList,
};
