import express from 'express';
import { wishListController } from './wishList.controller';

const router = express.Router();

// create wishList
router.post('/', wishListController.createWishList);

// get all wishList
router.get('/', wishListController.getAllWishList);

export const wishListRoutes = router;
