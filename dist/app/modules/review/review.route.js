"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_controller_1 = require("../book/book.controller");
const router = express_1.default.Router();
router.post('/review/:id', book_controller_1.BookController.addReview);
//* get all review
router.get('/review/:id', book_controller_1.BookController.getAllReview);
