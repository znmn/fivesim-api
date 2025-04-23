/**
 * Main 5sim API Client
 */
export { FiveSimAPI } from "./FiveSimAPI";

/**
 * Error types and utilities
 */
export {
	FiveSimError,
	AuthenticationError,
	RateLimitError,
	NotFoundError,
	NoPhoneNumbersError,
	InsufficientBalanceError,
	InsufficientRatingError,
	ValidationError,
	ServerError,
	OrderExpiredError,
	OrderHasSMSError,
	HostingOrderError,
	createError,
} from "./utils/error";

/**
 * Type exports
 */
export type {
	// API Response Types
	UserProfile,
	Order,
	OrderHistoryResponse,
	PaymentHistoryResponse,
	PriceLimit,
	ProductsResponse,
	PricesResponse,
	CountriesResponse,
	NotificationResponse,
	SMS,
	SMSInboxResponse,
	VendorProfile,
	VendorWallets,
	VendorOrdersResponse,
	VendorPaymentsResponse,
	SuccessResponse,
} from "./interfaces/responses";

export type {
	// Parameter Types
	OrderStatus,
	OrderHistoryOptions,
	PaginationOptions,
	BuyNumberOptions,
	SetPriceLimitParams,
	DeletePriceLimitParams,
	Language,
	PayoutMethod,
	FeeSystem,
	Country,
	Operator,
	WebhookEvent,
	APIErrorResponse,
} from "./interfaces/types";

/**
 * Service exports (optional, if users want to use services directly)
 */
export { GuestService } from "./services/guest.service";
export { UserService } from "./services/user.service";
