import httpStatus from 'http-status';
import supertest from 'supertest';
import faker from '@faker-js/faker';
import * as jwt from 'jsonwebtoken';
import { cleanDb } from '../helpers';
import app, { init } from '@/app';
import { hotelRepository, userRepository } from '@/repositories';

describe('GET booking with valid token', () => {
  it('should return status 200 and bookings of the current logged in user', async () => {
    jest.spyOn(userRepository, 'create').mockImplementation((): any => {
      return {
        id: 1,
        email: faker.internet.email(),
        password: 'secretPassword',
      };
    });

    jest.spyOn(hotelRepository, 'findHotels').mockImplementation((): any => {
      return {
        id: 1,
      };
    });
  });
});

// describe('POST booking', () => {
// });

// describe('PUT booking', () => {});
