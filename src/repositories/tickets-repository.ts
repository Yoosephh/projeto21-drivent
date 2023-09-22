import { prisma } from '@/config';
import { getUserTicket } from '@/controllers/tickets-controller';
import { notFoundError } from '@/errors';

async function ticketsType() {
  const tickets = await prisma.ticketType.findMany();
  return tickets;
}

async function getTicket(userId: number): Promise<getUserTicket> {
  const userEnrollment = await prisma.enrollment.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });
  if (userEnrollment.length === 0) throw notFoundError();
  const userTicket = await prisma.ticket.findMany({
    where: {
      enrollmentId: userEnrollment[0].id,
    },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      createdAt: true,
      updatedAt: true,
      TicketType: true,
    },
  });
  if (userTicket.length === 0) throw notFoundError();
  return userTicket[0];
}

async function postTicket(ticketTypeId: number, userId: number): Promise<getUserTicket> {
  const userEnrollment = await prisma.enrollment.findMany({
    where: {
      userId,
    },
    select: {
      id: true,
    },
  });
  if (userEnrollment.length === 0) throw notFoundError();
  const newTicketId = await prisma.ticket.create({
    data: {
      ticketTypeId,
      enrollmentId: userEnrollment[0].id,
      status: 'RESERVED',
    },
    select: {
      id: true,
    },
  });
  const userNewTicket = await prisma.ticket.findUnique({
    where: {
      id: newTicketId.id,
    },
    select: {
      id: true,
      status: true,
      ticketTypeId: true,
      enrollmentId: true,
      createdAt: true,
      updatedAt: true,
      TicketType: true,
    },
  });
  return userNewTicket;
}
export const ticketsRepository = { ticketsType, getTicket, postTicket };
