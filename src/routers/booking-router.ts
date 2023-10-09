import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { createUserBooking, getUserBooking, updateUserBooking } from '@/controllers/booking-controller';

const bookingRouter = Router();

bookingRouter
  .all('/*', authenticateToken)
  .get('/', getUserBooking)
  .post('/', createUserBooking)
  .put('/:bookingId', updateUserBooking);

export { bookingRouter };
