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
exports.userService = void 0;
const ApiError_1 = __importDefault(require("../../../errors/ApiError"));
const http_status_1 = __importDefault(require("http-status"));
const user_model_1 = require("./user.model");
const createNewUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check duplicate entries
        const existingUser = yield user_model_1.User.findOne({
            email: payload.email,
        });
        if (existingUser) {
            throw new ApiError_1.default(http_status_1.default.BAD_REQUEST, 'User already exists');
        }
        const createUser = yield user_model_1.User.create(payload);
        return createUser;
    }
    catch (error) {
        throw error;
    }
});
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.User.find();
        return users;
    }
    catch (error) {
        throw error;
    }
});
exports.userService = {
    createNewUser,
    getAllUsers
};
