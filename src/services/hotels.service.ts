import { notFoundError, paymentRequired } from '@/errors';
import { enrollmentRepository } from '@/repositories';
import { repositories } from '@/repositories/hotel-repositories';

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.selectEnrollmentTicket(userId);
  if (!enrollment) throw notFoundError();
  if (!enrollment.Ticket) throw notFoundError();
  if (enrollment.Ticket.status !== 'PAID') throw paymentRequired();
  if (enrollment.Ticket.TicketType.includesHotel === false) throw paymentRequired();
  if (enrollment.Ticket.TicketType.isRemote === true) throw paymentRequired();

  const hotels = await repositories.getHotels();
  if (hotels.length === 0) throw notFoundError();
  return hotels;
}

async function getHotel(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.selectEnrollmentTicket(userId);
  if (!enrollment) throw notFoundError();
  if (!enrollment.Ticket) throw notFoundError();
  if (enrollment.Ticket.status !== 'PAID') throw paymentRequired();
  if (enrollment.Ticket.TicketType.isRemote === true) throw paymentRequired();
  if (enrollment.Ticket.TicketType.includesHotel === false) throw paymentRequired();

  const hotel = await repositories.getHotel(hotelId);
  if (hotel === null) throw notFoundError();

  return hotel;
}

export const services = { getHotels, getHotel };
