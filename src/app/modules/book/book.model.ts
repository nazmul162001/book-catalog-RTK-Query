import { Schema, model } from 'mongoose'
import { IBook } from './book.interface'

// Creating a user schema
const bookSchema = new Schema<IBook>(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    image: { type: [String], required: true },
    discountPercentage: { type: Number, default: 0 },
    price: { type: Number, required: true },
    wishList: { type: [String], default: [] },
    rating: { type: Number, default: 0 },
    quantity: { type: Number, required: true },
    sellCount: { type: Number },
    status: { type: String, default: 'In Stock' },
    category: {
      type: String,
      enum: ['science', 'adventure', 'romance'],
      required: true,
    },
    discountTime: { type: Schema.Types.Mixed },
    seller: {
      type: String,
      required: true,
    },
    group: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

const Book = model<IBook>('Book', bookSchema)
export default Book
