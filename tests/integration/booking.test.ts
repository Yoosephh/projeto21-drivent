import supertest from 'supertest';
import httpStatus from 'http-status';
import faker from '@faker-js/faker';
import jwt from 'jsonwebtoken'; // Import jwt directly
import { TicketStatus } from '@prisma/client';
import { cleanDb, generateValidToken } from '../helpers';
import { createEnrollmentWithAddress, createTicket, createTicketType, createUser } from '../factories';
import { createHotel, createRoomWithHotelId } from '../factories/hotels-factory';
import { createBookingPrisma } from '../factories/booking-factory';
import app, { init } from '@/app';

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe('GET /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when given token is valid', () => {
    it('should respond with booking data', async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType(false, true);
      await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      const hotel = await createHotel();
      const room = await createRoomWithHotelId(hotel.id);
      const booking = await createBookingPrisma(user.id, room.id);

      const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual({
        id: booking.id,
        Room: {
          id: room.id,
          name: room.name,
          capacity: room.capacity,
          hotelId: room.hotelId,
          createdAt: room.createdAt.toISOString(),
          updatedAt: room.updatedAt.toISOString(),
        },
      });
    });
  });
});

describe('POST /booking', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  describe('when given token is valid', () => {
    describe('POST /booking', () => {
      let user;
      let token;
      let validRoomId;
      let invalidRoomId;

      it('should respond with status 400 if no body is given', async () => {
        user = await createUser();
        token = await generateValidToken(user);

        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it('should respond with status 400 if given body is invalid', async () => {
        user = await createUser();
        token = await generateValidToken(user);
        invalidRoomId = 'a';

        const body = { roomId: invalidRoomId };
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it('should respond with status 500 if user already has a booking', async () => {
        user = await createUser();
        token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        const hotel = await createHotel();
        validRoomId = (await createRoomWithHotelId(hotel.id)).id;
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
        await createBookingPrisma(user.id, validRoomId);

        const body = { roomId: validRoomId };
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.INTERNAL_SERVER_ERROR);
      });

      it('should create with success and respond with status 201', async () => {
        user = await createUser();
        token = await generateValidToken(user);
        const enrollment = await createEnrollmentWithAddress(user);
        const ticketType = await createTicketType(false, true);
        const hotel = await createHotel();
        validRoomId = (await createRoomWithHotelId(hotel.id)).id;
        await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);

        const body = { roomId: validRoomId };
        const response = await server.post('/booking').set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({
          bookingId: expect.any(Number),
        });
      });
    });
  });
});

describe('PUT /booking/:bookingId', () => {
  it('should respond with status 401 if no token is given', async () => {
    const response = await server.get('/booking');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/booking').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe('when given token is valid', () => {
    describe('PUT /booking/:bookingId', () => {
      it('should respond with status 400 if no body is given', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);

        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it('should respond with status 400 if given body is invalid', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = { roomId: faker.random.word() };

        const response = await server.put('/booking/1').set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it('should respond with status 400 if query param is invalid', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        const body = { roomId: 2 };

        const response = await server.put('/booking/aa').set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
        expect(response.body).toEqual({ message: 'Invalid data: bookingId invalid' });
      });

      it('should update with success and respond with status 201', async () => {
        const user = await createUser();
        const token = await generateValidToken(user);
        await createEnrollmentWithAddress(user);
        await createTicketType(false, true);
        const room = await createRoomWithHotelId(1);
        const room2 = await createRoomWithHotelId(2);
        const booking = await createBookingPrisma(user.id, room.id);
        const body = { roomId: room2.id };

        const response = await server.put(`/booking/${booking.id}`).set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual({ bookingId: expect.any(Number) });
      });
    });
  });
});
