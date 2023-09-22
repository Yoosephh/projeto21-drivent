import { Response } from 'express';
import httpStatus from 'http-status';
import { AuthenticatedRequest } from '@/middlewares';
import { ticketsService } from '@/services';
import { invalidDataError } from '@/errors';

export async function ticketsType(req: AuthenticatedRequest, res: Response) {
  const tickets = await ticketsService.ticketsType();
  if (tickets.length === 0) return res.status(httpStatus.OK).send([]);
  res.status(httpStatus.OK).send(tickets);
}

export async function getTicket(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId;
  const tickets = await ticketsService.getTicket(userId);
  console.log(tickets);
  res.status(httpStatus.OK).send(tickets);
}

export async function postTicket(req: AuthenticatedRequest, res: Response) {
  const ticketTypeId: number = Number(req.body.ticketTypeId);
  const userId = req.userId;
  if (!ticketTypeId || isNaN(ticketTypeId)) throw invalidDataError('Invalid ticketTypeId');
  const newTicket = await ticketsService.postTicket(ticketTypeId, userId);
  res.status(httpStatus.CREATED).send(newTicket);
}

export type getUserTicket = {
  id: number;
  status: string;
  ticketTypeId: number;
  enrollmentId: number;
  TicketType: {
    id: number;
    name: string;
    price: number;
    isRemote: boolean;
    includesHotel: boolean;
    createdAt: Date;
    updatedAt: Date;
  };
  createdAt: Date;
  updatedAt: Date;
};
