"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishList = void 0;
const mongoose_1 = require("mongoose");
const WishListSchema = new mongoose_1.Schema({
    bookId: { type: mongoose_1.Types.ObjectId, ref: 'Book' },
    userEmail: { type: String },
    status: { type: String, },
}, {
    timestamps: true,
    toJSON: {
        virtuals: true,
    },
});
exports.WishList = (0, mongoose_1.model)('WishList', WishListSchema);
