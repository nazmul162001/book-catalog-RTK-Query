import express from 'express'
import { UserController } from './user.controller'
import validateRequest from '../../middlewares/validateRequest'
import { UserValidation } from './user.validation'
const router = express.Router()

// create new user
router.post(
  '/signup',
  validateRequest(UserValidation.userValidationSchema),
  UserController.createUser
)
// get all user
router.get('/users', UserController.getAllUsers)

export const UserRoutes = router
