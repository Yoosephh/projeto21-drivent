import { notFoundError, paymentRequired } from '@/errors';
import { enrollmentRepository, ticketsRepository } from '@/repositories';
import { repositories } from '@/repositories/hotel-repositories';

async function getHotels(userId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const ticketType = await ticketsRepository.getTicketTypeById(ticket.id);
  if (ticket.status !== 'PAID' || !ticketType.includesHotel || ticketType.isRemote) throw paymentRequired();

  const hotels = await repositories.getHotels();

  return hotels;
}

async function getHotel(userId: number, hotelId: number) {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) throw notFoundError();

  const ticket = await ticketsRepository.findTicketByEnrollmentId(enrollment.id);
  if (!ticket) throw notFoundError();

  const ticketType = await ticketsRepository.getTicketTypeById(ticket.id);
  if (ticket.status !== 'PAID' || !ticketType.includesHotel || ticketType.isRemote) throw paymentRequired();

  const hotel = await repositories.getHotel(hotelId);
  if (hotel === null) throw notFoundError();

  return hotel;
}

export const services = { getHotels, getHotel };
