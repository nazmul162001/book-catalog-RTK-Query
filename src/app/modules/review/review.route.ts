import express from 'express'
import { BookController } from '../book/book.controller';
const router = express.Router()

 
router.post('/review/:id', BookController.addReview);

//* get all review
router.get('/review/:id', BookController.getAllReview);