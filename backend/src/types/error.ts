export class AppError extends Error {
  constructor(
    public statusCode: number,
    public status: string,
    message: string
  ) {
    super(message);
    this.statusCode = statusCode;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string) {
    super(400, 'ValidationError', message);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(404, 'NotFoundError', message);
  }
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(401, 'AuthenticationError', message);
  }
}