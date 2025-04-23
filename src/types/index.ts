/**
 * Options for pagination and ordering
 */
export interface PaginationOptions {
	/** Number of items per page */
	limit?: number;
	/** Number of items to skip */
	offset?: number;
	/** Field to order by */
	order?: string;
	/** Whether to reverse the order */
	reverse?: boolean;
}

/**
 * Options for order history
 */
export interface OrderHistoryOptions extends PaginationOptions {
	/** Category of orders to fetch */
	category?: "hosting" | "activation";
}

/**
 * Options for buying activation numbers
 */
export interface BuyNumberOptions {
	/** Enable call forwarding */
	forwarding?: boolean;
	/** Number for call forwarding (Russian numbers only, 11 digits) */
	number?: string;
	/** Enable number reuse if available */
	reuse?: "0" | "1";
	/** Enable robot call reception if available */
	voice?: "0" | "1";
	/** Referral key */
	ref?: string;
	/** Maximum price limit (only works with operator='any') */
	maxPrice?: number;
}

/**
 * User profile response
 */
export interface UserProfile {
	id: number;
	email: string;
	balance: number;
	rating: number;
	default_country: {
		name: string;
		iso: string;
		prefix: string;
	};
	default_operator: {
		name: string;
	};
	frozen_balance: number;
	default_forwarding_number: string;
	vendor: string;
}

/**
 * SMS message structure
 */
export interface SMS {
	created_at: string;
	date: string;
	sender: string;
	text: string;
	code: string;
}

/**
 * Order response structure
 */
export interface Order {
	id: number;
	phone: string;
	operator: string;
	product: string;
	price: number;
	status: OrderStatus;
	expires: string;
	sms: SMS[] | null;
	created_at: string;
	forwarding: boolean;
	forwarding_number: string;
	country: string;
}

/**
 * Possible order statuses
 */
export type OrderStatus =
	| "PENDING" // Preparation
	| "RECEIVED" // Waiting for SMS
	| "CANCELED" // Cancelled
	| "TIMEOUT" // Timeout
	| "FINISHED" // Complete
	| "BANNED"; // Number banned

/**
 * Payment history item structure
 */
export interface Payment {
	ID: number;
	TypeName: string;
	ProviderName: string;
	Amount: number;
	Balance: number;
	CreatedAt: string;
}

/**
 * Price limit structure
 */
export interface PriceLimit {
	id: number;
	product: string;
	price: number;
	CreatedAt: string;
}

/**
 * Product pricing structure
 */
export interface ProductPricing {
	Category: "hosting" | "activation";
	Qty: number;
	Price: number;
}

/**
 * Vendor profile structure
 */
export interface VendorProfile extends UserProfile {}

/**
 * Vendor wallets structure
 */
export interface VendorWallets {
	fkwallet?: number;
	payeer?: number;
	unitpay?: number;
}

/**
 * Country information structure
 */
export interface Country {
	iso: {
		[key: string]: number;
	};
	prefix: {
		[key: string]: number;
	};
	text_en: string;
	text_ru: string;
	[operator: string]: any;
}

/**
 * Notification response structure
 */
export interface Notification {
	text: string;
}

/**
 * Available payment methods for payouts
 */
export type PayoutMethod = "visa" | "qiwi" | "yandex";

/**
 * Available fee systems for payouts
 */
export type FeeSystem = "fkwallet" | "payeer" | "unitpay";

/**
 * Language options for notifications
 */
export type Language = "en" | "ru";
