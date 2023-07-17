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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishListController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const http_status_1 = __importDefault(require("http-status"));
const WishList_service_1 = require("./WishList.service");
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../config/config"));
// create WishList
const createWishList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const wishList = __rest(req.body, []);
    const token = req.headers.authorization;
    // console.log('token', token);
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    }
    catch (err) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid Refresh Token');
    }
    // console.log('verifiedToken =======', verifiedToken);
    const { userEmail } = verifiedToken;
    // console.log('Email 📩', userEmail);
    const result = yield WishList_service_1.WishListService.createWishList(Object.assign(Object.assign({}, wishList), { userEmail }), userEmail);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'WishList created successfully',
        data: result,
    });
}));
//* get all wishList
const getAllWishList = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield WishList_service_1.WishListService.getAllWishList();
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'WishList retrieved successfully',
        data: result.data,
    });
}));
exports.wishListController = {
    createWishList,
    getAllWishList,
};
