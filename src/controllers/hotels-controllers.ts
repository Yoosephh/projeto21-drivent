import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { services } from '@/services/hotels.service';

export async function getHotels(req: AuthenticatedRequest, res: Response) {
  const userId: number = req.body.userId;
  const hotels = await services.getHotels(userId);
  res.status(httpStatus.OK).send(hotels);
}

export async function getHotel(req: AuthenticatedRequest, res: Response) {
  const hotelId = Number(req.params.hotelId);
  const userId = Number(req.body.userId);
  const hotel = await services.getHotel(userId, hotelId);
  res.status(httpStatus.OK).send(hotel);
}
