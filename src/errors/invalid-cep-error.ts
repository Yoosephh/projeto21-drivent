import httpStatus from "http-status";
import { RequestError } from "@/protocols";

export function InvalidCepError(): RequestError{
  return{
    name: 'InvalidDataError',
    data: null,
    status: httpStatus.BAD_REQUEST,
    statusText: 'Bad Request',
    message: 'The given CEP is invalid'
  }
}