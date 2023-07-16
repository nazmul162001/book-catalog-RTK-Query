import express from 'express'
import { BookController } from './book.controller'
const router = express.Router()


router.post('/', BookController.createBook)
router.post('/review/:id', BookController.addReview);
router.get('/', BookController.getAllBooks)
router.get('/review/:id', BookController.getAllReview);
router.get('/:id', BookController.getSingleBook)
router.delete('/:id', BookController.deleteBook)
router.patch('/:id', BookController.updateBook)
export const BookRoutes = router
