import { Router } from 'express';
import { authenticateToken } from '@/middlewares';
import { getTicket, ticketsType } from '@/controllers/tickets-controller';

const ticketsRouter = Router();

ticketsRouter.all('/*', authenticateToken).get('/type', ticketsType).get('/', getTicket);
// .post('/tickets',  )

export { ticketsRouter };
