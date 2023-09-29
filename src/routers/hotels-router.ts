import { Router } from 'express';
import { getHotel, getHotels } from '@/controllers/hotels-controllers';
import { authenticateToken } from '@/middlewares';

const hotelsRouter = Router();
hotelsRouter.get('/', authenticateToken, getHotels);
hotelsRouter.get('/:hotelId', authenticateToken, getHotel);

export { hotelsRouter };
