"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// Creating a user schema
const bookSchema = new mongoose_1.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publicationDate: { type: String, required: true },
    // reviews: { type: [String], default: [] },
    reviews: [{ type: String }],
    image: { type: String, default: '' },
    userEmail: { type: String },
}, {
    timestamps: true,
});
const Book = (0, mongoose_1.model)('Book', bookSchema);
exports.default = Book;
