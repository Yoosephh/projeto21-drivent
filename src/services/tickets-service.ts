import { Ticket } from '@prisma/client';
import { ticketsRepository } from '@/repositories';

async function ticketsType(): Promise<TicketType[]> {
  const tickets = await ticketsRepository.ticketsType();
  return tickets;
}
async function getTickets(): Promise<Ticket[]> {
  const tickets = await ticketsRepository.getTickets();
  return tickets;
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

export const ticketsService = { ticketsType, getTickets };
