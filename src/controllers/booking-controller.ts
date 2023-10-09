import { Response } from 'express';
import { AuthenticatedRequest } from '@/middlewares';
import httpStatus from 'http-status';
import { bookingService } from '@/services/booking-service';
import { invalidDataError } from '@/errors';

export async function getUserBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const booking = await bookingService.getBooking(userId);

  res.status(httpStatus.OK).send(booking);
}

export async function createUserBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { roomId } = req.body;
  const response = await bookingService.createBooking(roomId, userId);
  res.status(httpStatus.OK).send(response);
}

export async function updateUserBooking(req: AuthenticatedRequest, res: Response) {
  const { userId } = req;
  const { bookingId } = req.params;
  const { roomId } = req.body;
  if (isNaN(Number(bookingId))) throw invalidDataError('booking id must be a valid ID number');
  const response = await bookingService.updateBooking(roomId, userId, Number(bookingId));
  res.status(httpStatus.OK).send(response);
}