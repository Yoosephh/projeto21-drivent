import { Hotel } from '@prisma/client';
import { prisma } from '@/config';

async function getHotels(): Promise<Hotel[]> {
  return await prisma.hotel.findMany();
}
async function getHotel(id: number) {
  const hotel = await prisma.hotel.findUnique({
    where: {
      id,
    },
    select: {
      Rooms: true,
    },
  });
  return hotel;
}

export const repositories = { getHotels, getHotel };
