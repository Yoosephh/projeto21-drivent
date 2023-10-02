import faker from '@faker-js/faker';
import { prisma } from '@/config';

export async function createHotelAndRoom() {
  return await prisma.hotel.create({
    data: {
      name: faker.company.companyName(),
      image: faker.image.imageUrl(),
      Rooms: {
        create: {
          capacity: faker.datatype.number(),
          name: faker.name.findName(),
        },
      },
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
