"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.wishListRoutes = void 0;
const express_1 = __importDefault(require("express"));
const wishList_controller_1 = require("./wishList.controller");
const router = express_1.default.Router();
// create wishList
router.post('/', wishList_controller_1.wishListController.createWishList);
// get all wishList
router.get('/', wishList_controller_1.wishListController.getAllWishList);
exports.wishListRoutes = router;
