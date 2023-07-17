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
exports.BookController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const pick_1 = __importDefault(require("../../../shared/pick"));
const pagination_1 = require("../../../constants/pagination");
const book_constant_1 = require("./book.constant");
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../config/config"));
const book_service_1 = require("./book.service");
const book_model_1 = __importDefault(require("./book.model"));
const { ObjectId } = require('mongodb');
// create a new book
const createBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookData = __rest(req.body, []);
    const token = req.headers.authorization;
    let verifiedToken = null;
    verifiedToken = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
    const { userEmail } = verifiedToken;
    const result = yield book_service_1.bookService.createNewBook(Object.assign(Object.assign({}, bookData), { userEmail }), // Add userEmail to the bookData object
    userEmail);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book created successfully!',
        data: result,
    });
}));
// get all books
const getAllBooks = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const filters = (0, pick_1.default)(req.query, book_constant_1.bookFilterableField);
    const paginationOptions = (0, pick_1.default)(req.query, pagination_1.paginationFields);
    const result = yield book_service_1.bookService.getAllBooks(filters, paginationOptions);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All books retrieved successfully!',
        meta: result.meta,
        data: result.data,
    });
}));
// get single book
const getSingleBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const book = yield book_service_1.bookService.getSingleBook(id);
    if (!book) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'Book not found');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book retrieved successfully!',
        data: book,
    });
}));
// delete book
const deleteBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const token = req.headers.authorization;
    yield book_service_1.bookService.deleteBook(id, token);
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Book deleted successfully!',
    });
}));
// update book
const updateBook = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updateData = req.body;
    const token = req.headers.authorization;
    const updatedBook = yield book_service_1.bookService.updateBook(id, updateData, token);
    if (!updatedBook) {
        throw new ApiError_1.default(http_status_1.default.NOT_FOUND, 'User not found');
    }
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User updated successfully!',
        data: updatedBook,
    });
}));
//* Add reviews
const addReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const addReview = req.body.reviews;
    const result = yield book_model_1.default.updateOne({ _id: id }, { $push: { reviews: addReview } });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Add Review successfully',
        data: result,
    });
}));
//* get reviews
const getAllReview = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    console.log(id);
    const result = yield book_model_1.default.findOne({ _id: id }).select({ reviews: 1, _id: 0 });
    (0, sendResponse_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'get all Review successfully',
        data: result,
    });
}));
exports.BookController = {
    createBook,
    getAllBooks,
    getSingleBook,
    deleteBook,
    updateBook,
    getAllReview,
    addReview,
};
