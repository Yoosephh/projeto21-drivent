import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotelAndRoom() {
  return await prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
    },
  });
}
export async function createRoom(hotelId: number) {
  return await prisma.room.create({
    data: {
      hotelId,
      capacity: faker.datatype.number(),
      name: faker.name.findName(),
    },
  });
}
export async function createHotel() {
  return await prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
    },
  });
}
