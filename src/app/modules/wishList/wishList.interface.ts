import { Model, Types } from 'mongoose';
import { IBook } from '../book/book.interface';

export type IStatus = 'reading' | 'plan to read' | 'finished';

export type IWishList = {
  bookId?: Types.ObjectId | IBook;
  userEmail?: string;
  status?: IStatus;
};

export type WishListModel = Model<IWishList, Record<string, unknown>>;

export type IWishListFilter = {
  searchTerm?: string;
  status?: IStatus;
};
