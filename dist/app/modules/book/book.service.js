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
exports.bookService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const paginationHelper_1 = require("../../../helpers/paginationHelper");
const book_constant_1 = require("./book.constant");
const jwtHelper_1 = require("../../../helpers/jwtHelper");
const config_1 = __importDefault(require("../../../config/config"));
const book_model_1 = __importDefault(require("./book.model"));
const createNewBook = (payload, userEmail) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingBook = yield book_model_1.default.findOne(payload);
        if (existingBook) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Book already exists');
        }
        // const bookData = Object.assign({}, payload, { userEmail }) // Add userEmail to the payload
        const createdBook = yield book_model_1.default.create(payload);
        if (!createdBook) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'Failed to create book');
        }
        return createdBook;
    }
    catch (error) {
        throw error;
    }
});
// get allCows
const getAllBooks = (filters, paginationOptions) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchTerm } = filters, filtersData = __rest(filters
    // shortCut way
    , ["searchTerm"]);
    // shortCut way
    const andConditions = [];
    // search term
    if (searchTerm)
        andConditions.push({
            $or: book_constant_1.bookSearchableFields.map((field) => ({
                [field]: {
                    $regex: searchTerm,
                    $options: 'i',
                },
            })),
        });
    // exact filter
    if (Object.keys(filtersData).length) {
        andConditions.push({
            $and: Object.entries(filtersData).map(([field, value]) => ({
                [field]: {
                    $regex: new RegExp(`\\b${value}\\b`, 'i'),
                },
            })),
        });
    }
    const { page, sortBy, sortOrder } = paginationHelper_1.paginationHelper.calculatePagination(paginationOptions);
    const sortConditions = {};
    if (sortBy && sortOrder) {
        sortConditions[sortBy] = sortOrder;
    }
    let whereConditions = andConditions.length > 0 ? { $and: andConditions } : {};
    const result = yield book_model_1.default.find(whereConditions)
        .sort(sortConditions);
    const total = yield book_model_1.default.countDocuments();
    return {
        meta: {
            page,
            total,
        },
        data: result,
    };
});
const getSingleBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const book = yield book_model_1.default.findById(id);
        return book;
    }
    catch (error) {
        throw error;
    }
});
// delete book
const deleteBook = (id, token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        const { userEmail } = verifiedToken;
        // Find the book document by id
        const book = yield book_model_1.default.findById(id);
        if (!book) {
            throw new Error('Book not found');
        }
        // Compare the userEmail from the token with the userEmail in the book data
        if (book.userEmail !== userEmail) {
            throw new Error("You can't delete this book");
        }
        const bookData = yield book_model_1.default.findByIdAndDelete(id);
        if (!bookData) {
            throw new Error('Book not found');
        }
    }
    catch (error) {
        throw error;
    }
});
// update book
const updateBook = (id, payload, token) => __awaiter(void 0, void 0, void 0, function* () {
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelper_1.jwtHelpers.verifyToken(token, config_1.default.jwt.secret);
        const { userEmail } = verifiedToken;
        // Find the book document by id
        const book = yield book_model_1.default.findById(id);
        if (!book) {
            throw new Error('Book not found');
        }
        // Compare the userEmail from the token with the userEmail in the book data
        if (book.userEmail !== userEmail) {
            throw new Error("You can't update this book");
        }
        const updateBook = yield book_model_1.default.findByIdAndUpdate(id, payload, { new: true });
        return updateBook;
    }
    catch (error) {
        throw new ApiError_1.default(http_status_1.default.FORBIDDEN, 'Invalid refresh token');
    }
});
exports.bookService = {
    createNewBook,
    getAllBooks,
    getSingleBook,
    deleteBook,
    updateBook,
};
