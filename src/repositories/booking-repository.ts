import { prisma } from '@/config';

async function findBookingByUserId(userId: number) {
  return await prisma.booking.findFirst({
    where: {
      userId,
    },
    select: {
      id: true,
      Room: true,
    },
  });
}

async function findRoomById(roomId: number) {
  return await prisma.room.findFirst({
    where: { id: roomId },
  });
}

async function bookingListByRoom(roomId: number) {
  return await prisma.booking.findMany({
    where: { roomId },
  });
}
async function createBooking(userId: number, roomId: number) {
  const result = await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
    select: { id: true },
  });
  return { bookingId: result.id };
}

async function updateBooking(bookingId: number, roomId: number) {
  const result = await prisma.booking.update({
    where: { id: bookingId },
    data: { roomId },
    select: { id: true },
  });
  return { bookingId: result.id };
}
export const bookingRepository = {
  findBookingByUserId,
  createBooking,
  updateBooking,
  findRoomById,
  bookingListByRoom,
};
