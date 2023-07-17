import express from 'express'
import { UserRoutes } from '../modules/user/user.route'
import { AuthRoutes } from '../modules/auth/auth.route'
import { BookRoutes } from '../modules/book/book.route'
import { wishListRoutes } from '../modules/wishList/wishList.route'
const router = express.Router()

const moduleRoutes = [
  {
    path: '/auth',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/books',
    route: BookRoutes,
  },
  {
    path: '/wishList',
    route: wishListRoutes,
  },
]

moduleRoutes.forEach((route) => router.use(route.path, route.route))

export default router
