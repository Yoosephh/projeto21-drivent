import { invalidDataError, notFoundError, paymentRequired } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { repositories } from '@/repositories/hotel-repositories';

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.selectEnrollmentTicket(userId);
  if (!enrollment) throw notFoundError();
  if (!enrollment.Ticket) throw notFoundError();
  if (enrollment.Ticket.status !== 'PAID') throw paymentRequired();
  if (enrollment.Ticket.TicketType.includesHotel === false) paymentRequired();
  if (enrollment.Ticket.TicketType.isRemote === true) throw paymentRequired();

  const hotels = await repositories.getHotels();
  if (hotels.length === 0) throw notFoundError();
  return hotels;
}

async function getHotel(userId: number, hotelId: number) {
  if (isNaN(hotelId)) {
    throw invalidDataError('Format of hotelId is not valid, must be a number.');
  }
  const enrollment = await enrollmentRepository.selectEnrollmentTicket(userId);
  if (!enrollment) throw notFoundError();
  if (!enrollment.Ticket) throw notFoundError();
  if (enrollment.Ticket.status !== 'PAID') throw paymentRequired();
  if (enrollment.Ticket.TicketType.includesHotel === false) paymentRequired();
  if (enrollment.Ticket.TicketType.isRemote === true) throw paymentRequired();

  const hotel = await repositories.getHotel(hotelId);
  if (hotel === null) throw notFoundError();

  return hotel;
}

export const services = { getHotels, getHotel };
