class ApiError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = true;
        Error.captureStackTrace = (this, this.constuctor);
    };

    static badRequest(message = "bad-request"){
        throw new ApiError(message, 400);
    }

    static notFound(message = "not-found") {
        throw new ApiError(message, 404);
    }

    static unauthorized(message = "unauthorized"){
        throw new ApiError(message, 401);
    }

    static conflict(message = "conflict"){
        throw new ApiError(message, 409);
    }

    static forbidden(message = "forbidden"){
        throw new ApiError(message, 403);
    }

}

export default ApiError;