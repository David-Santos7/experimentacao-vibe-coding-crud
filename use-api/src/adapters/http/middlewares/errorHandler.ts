import type { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { EmailAlreadyExistsError } from "../../../application/errors/EmailAlreadyExistsError.js";
import { UserNotFoundError } from "../../../application/errors/UserNotFoundError.js";
import { DomainValidationError } from "../../../domain/entities/User.js";

export const errorHandler: ErrorRequestHandler = (
  error: unknown,
  _request,
  response,
  _next,
) => {
  if (error instanceof ZodError) {
    response.status(400).json({
      error: "INVALID_REQUEST",
      message: "Invalid request data.",
    });
    return;
  }

  if (error instanceof DomainValidationError) {
    response.status(400).json({
      error: "DOMAIN_VALIDATION_ERROR",
      message: error.message,
    });
    return;
  }

  if (error instanceof UserNotFoundError) {
    response.status(404).json({
      error: "USER_NOT_FOUND",
      message: error.message,
    });
    return;
  }

  if (error instanceof EmailAlreadyExistsError) {
    response.status(409).json({
      error: "EMAIL_ALREADY_EXISTS",
      message: error.message,
    });
    return;
  }

  response.status(500).json({
    error: "INTERNAL_SERVER_ERROR",
    message: "An unexpected error occurred.",
  });
};
