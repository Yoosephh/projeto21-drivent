import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTickets, ticketsType } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/type', ticketsType).get('/', getTickets);
// .post('/tickets',  )

export { ticketsRouter };
