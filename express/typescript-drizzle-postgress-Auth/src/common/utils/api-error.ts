class ApiError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }

  static notFound(message = "not-found") {
    return new ApiError(message, 404);
  }

  static unauthorized(message = "unauthorized") {
    return new ApiError(message, 401);
  }

  static badRequest(message = "bad-request") {
    return new ApiError(message, 400);
  }
}

export default ApiError;
