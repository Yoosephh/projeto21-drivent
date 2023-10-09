import faker from '@faker-js/faker';

import { createRoomWithBooking } from '../factories/booking-factory';

import { bookingRepository, hotelRepository, ticketsRepository, userRepository } from '@/repositories';
import { bookingService } from '@/services/booking-service';

beforeEach(() => {
  jest.clearAllMocks();
});

describe('GET booking', () => {
  it('should return status 400 if user dont have a booking yet', async () => {
    const userId = 1;

    const response = await bookingService.getBooking(userId);
    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });

  it('should return status 200 and bookings of the current logged in user', async () => {
    const userId = 1;
    const userBooking = createRoomWithBooking();

    jest.spyOn(bookingRepository, 'findBookingByUserId').mockImplementationOnce((): any => {
      return {
        userBooking,
      };
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

    const response = await bookingService.createBooking(roomId, userId);
    expect(response).rejects.toEqual({
      name: 'NotFoundError',
      message: 'No result for this search!',
    });
  });
});

// describe('PUT booking', () => {});
