import { APIErrorResponse } from "../interfaces/types";

/**
 * Base class for all 5sim API errors
 */
export class FiveSimError extends Error {
	public status?: number;
	public response?: APIErrorResponse;

	constructor(message: string, status?: number, response?: APIErrorResponse) {
		super(message);
		this.name = "FiveSimError";
		this.status = status;
		this.response = response;
	}
}

/**
 * Error thrown when authentication fails
 */
export class AuthenticationError extends FiveSimError {
	constructor(message: string = "Authentication failed. Please check your API token.") {
		super(message, 401);
		this.name = "AuthenticationError";
	}
}

/**
 * Error thrown when rate limits are exceeded
 */
export class RateLimitError extends FiveSimError {
	constructor(message: string = "Rate limit exceeded. Please slow down your requests.") {
		super(message, 429);
		this.name = "RateLimitError";
	}
}

/**
 * Error thrown when a resource is not found
 */
export class NotFoundError extends FiveSimError {
	constructor(message: string = "The requested resource was not found.") {
		super(message, 404);
		this.name = "NotFoundError";
	}
}

/**
 * Error thrown when there are no available phone numbers
 */
export class NoPhoneNumbersError extends FiveSimError {
	constructor(message: string = "No phone numbers available for the requested parameters.") {
		super(message, 400);
		this.name = "NoPhoneNumbersError";
	}
}

/**
 * Error thrown when the user has insufficient balance
 */
export class InsufficientBalanceError extends FiveSimError {
	constructor(message: string = "Insufficient balance to complete the operation.") {
		super(message, 400);
		this.name = "InsufficientBalanceError";
	}
}

/**
 * Error thrown when the user has insufficient rating
 */
export class InsufficientRatingError extends FiveSimError {
	constructor(message: string = "Insufficient rating to complete the operation.") {
		super(message, 400);
		this.name = "InsufficientRatingError";
	}
}

/**
 * Error thrown when an invalid parameter is provided
 */
export class ValidationError extends FiveSimError {
	constructor(message: string) {
		super(message, 400);
		this.name = "ValidationError";
	}
}

/**
 * Error thrown when the server is unavailable
 */
export class ServerError extends FiveSimError {
	constructor(message: string = "The 5sim server is currently unavailable. Please try again later.") {
		super(message, 503);
		this.name = "ServerError";
	}
}

/**
 * Error thrown when an order has expired
 */
export class OrderExpiredError extends FiveSimError {
	constructor(message: string = "The order has expired.") {
		super(message, 400);
		this.name = "OrderExpiredError";
	}
}

/**
 * Error thrown when an order already has SMS
 */
export class OrderHasSMSError extends FiveSimError {
	constructor(message: string = "The order already has SMS messages.") {
		super(message, 400);
		this.name = "OrderHasSMSError";
	}
}

/**
 * Error thrown when attempting operations on a hosting order that are not allowed
 */
export class HostingOrderError extends FiveSimError {
	constructor(message: string = "This operation is not allowed for hosting orders.") {
		super(message, 400);
		this.name = "HostingOrderError";
	}
}

/**
 * Helper function to create appropriate error based on API response
 */
export function createError(error: any): FiveSimError {
	if (!error.response) {
		return new FiveSimError("Network error occurred", 0, error);
	}

	const { status, data } = error.response;
	const message = data?.message || JSON.stringify(data);

	switch (status) {
		case 401:
			return new AuthenticationError();
		case 404:
			return new NotFoundError();
		case 429:
			return new RateLimitError();
		case 503:
			return new ServerError();
		case 400:
			if (message.includes("no free phones")) {
				return new NoPhoneNumbersError();
			}
			if (message.includes("not enough user balance")) {
				return new InsufficientBalanceError();
			}
			if (message.includes("not enough rating")) {
				return new InsufficientRatingError();
			}
			if (message.includes("order expired")) {
				return new OrderExpiredError();
			}
			if (message.includes("order has sms")) {
				return new OrderHasSMSError();
			}
			if (message.includes("hosting order")) {
				return new HostingOrderError();
			}
			return new ValidationError(message);
		default:
			return new FiveSimError(message, status, data);
	}
}
