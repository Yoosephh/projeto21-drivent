import faker from '@faker-js/faker';
import { Booking, Room, TicketStatus, TicketType } from '@prisma/client';
import { prisma } from '@/config';

export async function createBookingPrisma(userId: number, roomId: number): Promise<Booking> {
  const result = await prisma.booking.create({
    data: {
      userId,
      roomId,
    },
  });

  return result;
}

export function createRoom(roomId: number, capacity = Number(faker.random.numeric(1))) {
  return {
    id: roomId,
    name: faker.commerce.product(),
    capacity: capacity,
    hotelId: Number(faker.random.numeric(1)),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
}

export function createTicket(status: TicketStatus, isRemote: boolean, includesHotel: boolean): TicketAndType {
  return {
    id: Number(faker.random.numeric(1)),
    status: status,
    TicketType: {
      id: Number(faker.random.numeric(1)),
      name: faker.commerce.product(),
      price: Number(faker.finance.amount()),
      isRemote: isRemote,
      includesHotel: includesHotel,
      createdAt: faker.date.past(),
      updatedAt: faker.date.recent(),
    },
  };
}

export function createBooking(userId: number, roomId: number): Booking {
  return {
    id: Number(faker.random.numeric(1)),
    userId,
    roomId,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  };
}

export function createRoomWithBooking(userId?: number): { id: number; Room: Room; userId?: number } {
  const roomData = createRoom(Number(faker.random.numeric(1)));
  const userData = userId ? { userId } : {};

  return {
    id: Number(faker.random.numeric(1)),
    Room: roomData,
    ...userData,
  };
}

export type TicketAndType = {
  id: number;
  status: TicketStatus;
  TicketType: TicketType;
};
