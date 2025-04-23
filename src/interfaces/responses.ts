import { OrderStatus } from "./types";

export interface UserProfile {
	id: number;
	email: string;
	vendor: string;
	default_forwarding_number: string;
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
}

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

export interface OrderHistoryResponse {
	Data: Order[];
	ProductNames: string[];
	Statuses: string[];
	Total: number;
}

export interface Payment {
	ID: number;
	TypeName: string;
	ProviderName: string;
	Amount: number;
	Balance: number;
	CreatedAt: string;
}

export interface PaymentHistoryResponse {
	Data: Payment[];
	PaymentTypes: Array<{ Name: string }>;
	PaymentProviders: Array<{ Name: string }>;
	Total: number;
}

export interface PriceLimit {
	id: number;
	product: string;
	price: number;
	CreatedAt: string;
}

export interface Product {
	Category: "hosting" | "activation";
	Qty: number;
	Price: number;
}

export interface ProductsResponse {
	[key: string]: Product;
}

export interface OperatorPricing {
	cost: number;
	count: number;
	rate: number;
}

export interface ProductPricing {
	[operator: string]: OperatorPricing;
}

export interface CountryPricing {
	[product: string]: ProductPricing;
}

export interface PricesResponse {
	[country: string]: CountryPricing;
}

export interface CountryOperator {
	activation?: number;
	hosting?: number;
}

export interface Country {
	iso: { [code: string]: number };
	prefix: { [prefix: string]: number };
	text_en: string;
	text_ru: string;
	[operator: string]: any;
}

export interface CountriesResponse {
	[country: string]: Country;
}

export interface SMS {
	id?: number;
	created_at: string;
	date: string;
	sender: string;
	text: string;
	code: string;
	is_wave?: boolean;
	wave_uuid?: string;
}

export interface SMSInboxResponse {
	Data: SMS[];
	Total: number;
}

export interface NotificationResponse {
	text: string;
}

export interface VendorProfile extends UserProfile {}

export interface VendorWallets {
	fkwallet?: number;
	payeer?: number;
	unitpay?: number;
}

export interface VendorOrdersResponse {
	Data: Order[];
	ProductNames: string[];
	Statuses: string[];
	Total: number;
}

export interface VendorPaymentsResponse {
	Data: Payment[];
	PaymentProviders: Array<{ Name: string }> | null;
	PaymentStatuses: Array<{ Name: string }> | null;
	PaymentTypes: Array<{ Name: string }> | null;
	Total: number;
}

// Generic success response
export interface SuccessResponse {
	success: boolean;
	message?: string;
}
