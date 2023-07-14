import { Schema, model } from 'mongoose'
import { IBook } from './book.interface'

// Creating a user schema
const bookSchema = new Schema<IBook>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    publicationDate: { type: String, required: true },
    reviews: { type: [String], default: [] },
    image: { type: String, default: '' },
    status: { type: String, default: 'Display' },
    userEmail: { type: String},
  },
  {
    timestamps: true,
  }
)

const Book = model<IBook>('Book', bookSchema)
export default Book
