import { Schema, Types, model } from 'mongoose';
import { IWishList, WishListModel } from './wishList.interface';

const WishListSchema: Schema<IWishList> = new Schema<IWishList>(
  {
    bookId: { type: Types.ObjectId, ref: 'Book' },
    userEmail: { type: String },
    status: { type: String, },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
    },
  },
);

export const WishList = model<IWishList, WishListModel>(
  'WishList',
  WishListSchema,
);
