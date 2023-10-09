import { Booking, Room } from '@prisma/client';
import { forbiddenError, notFoundError } from '@/errors';
import { invalidTicketError } from '@/errors/ticket-error';
import { ticketsRepository } from '@/repositories';
import { bookingRepository } from '@/repositories/booking-repository';

async function getBooking(userId: number) {
  const userBooking = await bookingRepository.findBookingByUserId(userId);
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
  const checkUserBooking = await bookingRepository.findBookingByUserId(userId);

  if (!checkUserBooking) throw forbiddenError("You can't update a booking whitout first having one.");

  capacityAndRoomValidation(
    await bookingRepository.findRoomById(roomId),
    await bookingRepository.bookingListByRoom(roomId),
  );

  return await bookingRepository.updateBooking(bookingId, roomId);
}

function capacityAndRoomValidation(room: Room, booking: Booking[]) {
  if (!room) throw notFoundError();

  if (booking.length >= room.capacity) {
    throw forbiddenError('Room capacity reached. Pick a different room.');
  }
}

export const bookingService = {
  getBooking,
  createBooking,
  updateBooking,
};
