import { prisma } from '@/config';

async function getHotels() {
  return await prisma.hotel.findMany();
}
async function getHotel(id: number) {
  const hotel = await prisma.hotel.findUnique({
    where: {
      id,
    },
  });
  return hotel;
}

export const repositories = { getHotels, getHotel };
