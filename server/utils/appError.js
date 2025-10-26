export class AppError extends Error { //capture the stack trace for this error - to help debug where the error occurred.
  constructor(message, statusCode) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; 
    Error.captureStackTrace(this, this.constructor);
  }
}
