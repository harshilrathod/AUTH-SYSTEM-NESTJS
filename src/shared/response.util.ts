import { HttpStatus } from '@nestjs/common';

export function response(httpStatus: HttpStatus, message, data = null) {
  return {
    statusCode: httpStatus,
    message: message,
    data: data,
  };
}
