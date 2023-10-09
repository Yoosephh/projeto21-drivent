import faker from '@faker-js/faker';

import { createRoomWithBooking } from '../factories/booking-factory';

import { bookingRepository, ticketsRepository } from '@/repositories';
import { bookingService } from '@/services/booking-service';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET booking', () => {
  it('should return status 404 if user dont have a booking yet', async () => {
    const userId = 1;
    jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
      return null;
    });

    const response = bookingService.getBooking(userId);
    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return status 200 and bookings of the current logged in user', async () => {
    const userId = 1;
    const userBooking = createRoomWithBooking(1);

    jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
      return userBooking;
    });

    const response = await bookingService.getBooking(userId);
    expect(response).toEqual(userBooking);
  });
});

describe('POST booking', () => {
  it('should return status 404 if user dont have a ticket yet', async () => {
    const userId = 1;
    const roomId = 3;

    jest.spyOn(ticketsRepository, 'findTicketByUserId').mockImplementationOnce((): any => {
      return null;
    });

    const response = bookingService.createBooking(roomId, userId);
    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return 404 if roomId dont exist', async () => {
    const userId = 1;
    const roomId = 3;

    jest.spyOn(ticketsRepository, 'findTicketByUserId').mockImplementationOnce((): any => {
      return {
        TicketType: {
          isRemote: false,
          includesHotel: true,
        },
        status: 'PAID',
      };
    });
    jest.spyOn(bookingRepository, 'findRoomById').mockImplementationOnce((): any => {
      return null;
    });

    const response = await bookingService.createBooking(roomId, userId);
    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return status 403 if the room isnt vacant', async () => {
    const userId = 1;
    const roomId = 3;
    jest.spyOn(ticketsRepository, 'findTicketByUserId').mockImplementationOnce((): any => {
      return {
        TicketType: {
          isRemote: false,
          includesHotel: true,
        },
        status: 'PAID',
      };
    });

    jest.spyOn(bookingRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 0,
      };
    });

    jest.spyOn(bookingRepository, 'bookingListByRoom').mockImplementationOnce((): any => {
      return [1, 2, 3];
    });

    const response = bookingService.createBooking(userId, roomId);
    expect(response).rejects.toEqual({
      name: 'forbiddenError',
      message: 'Room capacity reached. Pick a different room.',
    });
  });

  it('should return status 200 and bookingId', async () => {
    const userId = 1;
    const roomId = 3;
    const bookingId = 2;

    jest.spyOn(ticketsRepository, 'findTicketByUserId').mockImplementationOnce((): any => {
      return {
        TicketType: {
          isRemote: false,
          includesHotel: true,
        },
        status: 'PAID',
      };
    });

    jest.spyOn(bookingRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
        id: roomId,
      };
    });

    jest.spyOn(bookingRepository, 'bookingListByRoom').mockImplementationOnce((): any => {
      return [];
    });

    jest.spyOn(bookingService, 'createBooking').mockImplementationOnce((): any => {
      return {
        bookingId: bookingId,
      };
    });
    const response = await bookingService.createBooking(userId, roomId);

    expect(response).resolves.toEqual({ bookingId: bookingId });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should return status 403 if user dont have a booking', async () => {
    jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
      return null;
    });

    const response = bookingService.updateBooking(1, 2, 3);

    expect(response).rejects.toEqual({
      name: 'forbiddenError',
      message: "You can't update a booking whitout first having one.",
    });
  });

  it('should return status 404 if room dont exist', async () => {

    jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
      return { bookingId: 1 };
    });

    jest.spyOn(bookingRepository, 'findRoomById').mockImplementationOnce((): any => {
      return null;
    });

    jest.spyOn(bookingRepository, 'bookingListByRoom').mockImplementationOnce((): any => {
      return [2];
    });

    const response = await bookingService.updateBooking(1, 1, 1);

    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return status 403 if the room isnt vacant', async () => {
    const userId = 1;
    const roomId = 2;

    jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
      return {
        bookingId: 1,
      };
    });
    jest.spyOn(bookingRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 0,
      };
    });
    jest.spyOn(bookingRepository, 'bookingListByRoom').mockImplementationOnce((): any => {
      return [1, 2];
    });

    const response = await bookingService.updateBooking(roomId, userId, 3);
    expect(response).rejects.toEqual({
      name: 'forbiddenError',
      message: 'Room capacity reached. Pick a different room.',
    });
  });

  it('should return status 200 and bookingId', async () => {
    const userId = 2;
    const roomId = 1;

    jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
      return { bookingId: 1 };
    });
    jest.spyOn(bookingRepository, 'findRoomById').mockImplementationOnce((): any => {
      return {
        capacity: 3,
      };
    });
    jest.spyOn(bookingRepository, 'bookingListByRoom').mockImplementationOnce((): any => {
      return [1];
    });
    jest.spyOn(bookingRepository, 'updateBooking').mockImplementationOnce((): any => {
      return {
        bookingId: 2,
      };
    });

    const response = bookingService.updateBooking(roomId, userId, 1);

    expect(response).resolves.toEqual({ bookingId: 2 });
  });
});
