import { ApplicationError } from '@/protocols';

export function invalidTicketError(details: string): ApplicationError {
  return {
    name: 'TicketError',
    message: `Invalid data: ${details}`,
  };
}
