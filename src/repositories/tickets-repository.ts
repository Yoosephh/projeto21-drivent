import { prisma } from '@/config';

async function ticketsType() {
  const tickets = await prisma.ticketType.findMany();
  return tickets;
}

async function getTickets() {
  const tickets = await prisma.ticket.findMany();
  return tickets;
}

// async function postTickets() {
// }
export const ticketsRepository = { ticketsType, getTickets };
