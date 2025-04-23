// Order status enum based on API documentation
export enum OrderStatus {
	PENDING = "PENDING", // Preparation
	RECEIVED = "RECEIVED", // Waiting of receipt of SMS
	CANCELED = "CANCELED", // Is cancelled
	TIMEOUT = "TIMEOUT", // A timeout
	FINISHED = "FINISHED", // Is complete
	BANNED = "BANNED", // Number banned, when number already used
}

// Request parameters interfaces
export interface PaginationOptions {
	limit?: number;
	offset?: number;
	order?: string;
	reverse?: boolean;
}

export interface OrderHistoryOptions extends PaginationOptions {
	category?: "hosting" | "activation";
}

export interface BuyNumberOptions {
	forwarding?: boolean;
	number?: string; // Number for call forwarding (Russian numbers only, 11 digits)
	reuse?: "0" | "1"; // If '1', buy with the ability to reuse the number
	voice?: "0" | "1"; // If '1', buy with the ability to receive a call from the robot
	ref?: string; // Referral key
	maxPrice?: number; // Maximum price limit (only works with operator='any')
}

export interface SetPriceLimitParams {
	product_name: string;
	price: number;
}

export interface DeletePriceLimitParams {
	product_name: string;
}

// API parameter types
export type Language = "en" | "ru";
export type PayoutMethod = "visa" | "qiwi" | "yandex";
export type FeeSystem = "fkwallet" | "payeer" | "unitpay";

// Use 'any' for situations where a specific country or operator code is allowed
export type Country = string | "any";
export type Operator = string | "any" | "best";

// Webhook types (if supported by API)
export interface WebhookEvent {
	type: string;
	order_id: number;
	status: OrderStatus;
	created_at: string;
	[key: string]: any;
}

// Error response type
export interface APIErrorResponse {
	status: number;
	message: string;
	code?: string;
	details?: any;
}
