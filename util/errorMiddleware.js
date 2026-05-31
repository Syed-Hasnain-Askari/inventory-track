// util/errorMiddleware.js

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(statusCode, message, isOperational = true, stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

const DEFAULT_ALLOWED_ORIGINS = [
  "http://localhost:3001",
  "http://127.0.0.1:3001",
];

const getAllowedOrigins = () => {
  return (
    process.env.CORS_ORIGINS?.split(",")
      .map((origin) => origin.trim())
      .filter(Boolean) || DEFAULT_ALLOWED_ORIGINS
  );
};

const applyCorsHeaders = (req, res) => {
  const origin = req.headers.origin;
  const requestHeaders = req.headers["access-control-request-headers"];
  const allowedOrigins = getAllowedOrigins();

  res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    requestHeaders || "Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Max-Age", "86400");

  const currentVary = res.getHeader("Vary");
  res.setHeader("Vary", currentVary ? `${currentVary}, Origin` : "Origin");

  if (origin && allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
};

/**
 * Standardized error response formatter
 */
export const handleError = (err, res) => {
  let { statusCode = 500, message } = err;

  // Handle specific Mongoose/Database errors
  if (err.name === "ValidationError") statusCode = 400;
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
  }
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  const response = {
    success: false,
    message: message || "Internal Server Error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  };

  console.error(`[API ERROR] ${statusCode} - ${message}`);
  if (process.env.NODE_ENV === "development") {
    console.error(err.stack);
  }

  return res.status(statusCode).json(response);
};

/**
 * Wrapper for API handlers to eliminate try-catch blocks and provide helpers
 */
export const apiHandler = (handler) => async (req, res) => {
  applyCorsHeaders(req, res);

  if (req.method === "OPTIONS") {
    return res.status(204).end();
  }

  // Attach success helper
  res.success = (result, message = "Success", statusCode = 200, extras = {}) => {
    return res.status(statusCode).json({
      success: true,
      message,
      result,
      ...extras,
    });
  };

  try {
    await handler(req, res);
  } catch (error) {
    return handleError(error, res);
  }
};

