import { notFoundError } from '@/errors';
import { invalidTicketError } from '@/errors/ticket-error';
import { ticketsRepository } from '@/repositories';
import { bookingRepository } from '@/repositories/booking-repository';

async function getBooking(userId: number) {
  const userBooking = await bookingRepository.findBooking(userId);
  if (userBooking === null) throw notFoundError();

  return userBooking;
}

async function createBooking(roomId: number, userId: number) {
  const userTicketInfo = await ticketsRepository.findTicketByUserId(userId);
  if (userTicketInfo === null) throw notFoundError();
  if (userTicketInfo.status !== 'PAID') throw invalidTicketError('Ticket status must be paid!');
  if (!userTicketInfo.TicketType.includesHotel) {
    throw invalidTicketError('Ticket should include hotel in order to make a booking.');
  }
  if (userTicketInfo.TicketType.isRemote) {
    throw invalidTicketError('Enrollment shoud be presencial in order to make a booking.');
  }
  return await bookingRepository.createBooking(userId, roomId);
}

async function updateBooking(roomId: number, userId: number, bookingId: number) {
  const checkUserBooking = await bookingRepository.findBooking(userId);
  if(!checkUserBooking) throw 
}

export const bookingService = {
  getBooking,
  createBooking,
  updateBooking,
};
