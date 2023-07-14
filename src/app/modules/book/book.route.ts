import express from 'express'
import { BookController } from './book.controller'
import auth from '../../middlewares/auth'
import { ENUM_USER_ROLE } from '../../../enums/user'
const router = express.Router()

router.post('/', auth(ENUM_USER_ROLE.SELLER), BookController.createBook)
router.get(
  '/',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
  BookController.getAllBooks
)
router.get(
  '/:id',
  auth(ENUM_USER_ROLE.ADMIN, ENUM_USER_ROLE.SELLER, ENUM_USER_ROLE.BUYER),
  BookController.getSingleBook
)
router.delete('/:id', auth(ENUM_USER_ROLE.SELLER), BookController.deleteBook)
router.patch('/:id', auth(ENUM_USER_ROLE.SELLER), BookController.updateBook)
export const BookRoutes = router
