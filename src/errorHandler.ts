import type { StatusCode } from 'hono/utils/http-status';

interface errorType {
  statusCode: StatusCode;
  message: string;
  error: Error;
}

export default (error: Error): errorType => {
  let statusCode: StatusCode;

  switch (error.name) {
    case 'validationError':
      statusCode = 400;
      break;

    case 'NotFoundError':
      statusCode = 404;
      break;

    case 'AuthorizationError':
      statusCode = 401;
      break;

    default:
      statusCode = 500;
      error.message = 'An unexpected error has occurred.';
      break;
  }

  return {
    message: error.message,
    statusCode,
    error,
  };
};
