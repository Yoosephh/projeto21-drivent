import { ticketsRepository } from '@/repositories';
import { getUserTicket } from '@/controllers/tickets-controller';

async function ticketsType(): Promise<TicketType[]> {
  const tickets = await ticketsRepository.ticketsType();
  return tickets;
}
async function getTicket(userId: number): Promise<getUserTicket> {
  const tickets = await ticketsRepository.getTicket(userId);
  return tickets;
}

async function postTicket(ticketTypeId: number, userId: number): Promise<getUserTicket> {
  const newTicket = await ticketsRepository.postTicket(ticketTypeId, userId);
  return newTicket;
}

export type TicketType = {
  id: number;
  name: string;
  price: number;
  isRemote: boolean;
  includesHotel: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export const ticketsService = { ticketsType, getTicket, postTicket };
