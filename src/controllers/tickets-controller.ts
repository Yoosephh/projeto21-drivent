import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';

export async function ticketsType(req: AuthenticatedRequest, res: Response) {
  const tickets = await ticketsService.ticketsType();

  res.status(httpStatus.OK).send(tickets);
}

export async function getTickets(req: AuthenticatedRequest, res: Response) {
  const tickets = await ticketsService.getTickets();
  res.status(httpStatus.OK).send(tickets);
}
