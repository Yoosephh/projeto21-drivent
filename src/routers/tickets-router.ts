import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicket, postTicket, ticketsType } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/types', ticketsType).get('/', getTicket).post('/', postTicket);

export { ticketsRouter };
