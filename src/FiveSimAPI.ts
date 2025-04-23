import { GuestService } from "./services/guest.service";
import { UserService } from "./services/user.service";
import type {
	UserProfile,
	Order,
	OrderHistoryResponse,
	PaymentHistoryResponse,
	PriceLimit,
	ProductsResponse,
	PricesResponse,
	CountriesResponse,
	NotificationResponse,
	SMSInboxResponse,
	VendorProfile,
	VendorWallets,
	VendorOrdersResponse,
	VendorPaymentsResponse,
	SuccessResponse,
} from "./interfaces/responses";
import type { OrderHistoryOptions, PaginationOptions, BuyNumberOptions, Language, Country, Operator, PayoutMethod, FeeSystem } from "./interfaces/types";

/**
 * Main class for interacting with the 5sim API
 * Combines both guest (static) and authenticated methods
 */
export class FiveSimAPI extends UserService {
	constructor(token: string) {
		super(token);
	}

	// Static methods from GuestService
	static getProducts = GuestService.getProducts;
	static getPrices = GuestService.getPrices;
	static getPricesByCountry = GuestService.getPricesByCountry;
	static getPricesByProduct = GuestService.getPricesByProduct;
	static getPricesByCountryAndProduct = GuestService.getPricesByCountryAndProduct;
	static getNotifications = GuestService.getNotifications;
	static getCountries = GuestService.getCountries;

	// All instance methods are inherited from UserService
}

// Re-export types for easier access
export type {
	// Response types
	UserProfile,
	Order,
	OrderHistoryResponse,
	PaymentHistoryResponse,
	PriceLimit,
	ProductsResponse,
	PricesResponse,
	CountriesResponse,
	NotificationResponse,
	SMSInboxResponse,
	VendorProfile,
	VendorWallets,
	VendorOrdersResponse,
	VendorPaymentsResponse,
	SuccessResponse,

	// Parameter types
	OrderHistoryOptions,
	PaginationOptions,
	BuyNumberOptions,
	Language,
	Country,
	Operator,
	PayoutMethod,
	FeeSystem,
};

// Re-export error types
export * from "./utils/error";
