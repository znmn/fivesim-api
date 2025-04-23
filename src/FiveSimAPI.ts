import axios, { AxiosInstance } from "axios";
import { createError } from "./errors";
import type {
	BuyNumberOptions,
	OrderHistoryOptions,
	PaginationOptions,
	UserProfile,
	Order,
	Payment,
	PriceLimit,
	ProductPricing,
	VendorProfile,
	VendorWallets,
	Country,
	Notification,
	Language,
	PayoutMethod,
	FeeSystem,
	SMS,
} from "./types";

/**
 * FiveSimAPI class provides methods to interact with the 5sim.net API
 * @class
 */
export class FiveSimAPI {
	/** Base URL for the 5sim API */
	private static readonly baseURL: string = "https://5sim.net/v1";

	/** Axios instance for authenticated requests */
	private readonly client: AxiosInstance;

	/** API token */
	private readonly token: string;

	/**
	 * Creates a new instance of FiveSimAPI
	 * @param {string} token - Your 5sim API token
	 * @throws {Error} If no token is provided
	 */
	constructor(token: string) {
		if (!token) {
			throw new Error("API token is required");
		}

		this.token = token;
		this.client = axios.create({
			baseURL: FiveSimAPI.baseURL,
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
			},
		});
	}

	/**
	 * Get available products for a specific country and operator
	 * @param {string} country - Country name (e.g., 'russia')
	 * @param {string} operator - Operator name (e.g., 'any')
	 * @returns {Promise<Record<string, ProductPricing>>} Available products with pricing
	 * @static
	 */
	static async getProducts(country: string, operator: string): Promise<Record<string, ProductPricing>> {
		try {
			const response = await axios.get(`${this.baseURL}/guest/products/${country}/${operator}`, {
				headers: { Accept: "application/json" },
			});
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get all prices
	 * @returns {Promise<any>} Pricing information
	 * @static
	 */
	static async getPrices(): Promise<any> {
		try {
			const response = await axios.get(`${this.baseURL}/guest/prices`, {
				headers: { Accept: "application/json" },
			});
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get prices for a specific country
	 * @param {string} country - Country name
	 * @returns {Promise<any>} Pricing information for the country
	 * @static
	 */
	static async getPricesByCountry(country: string): Promise<any> {
		try {
			const response = await axios.get(`${this.baseURL}/guest/prices`, {
				headers: { Accept: "application/json" },
				params: { country },
			});
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get prices for a specific product
	 * @param {string} product - Product name
	 * @returns {Promise<any>} Pricing information for the product
	 * @static
	 */
	static async getPricesByProduct(product: string): Promise<any> {
		try {
			const response = await axios.get(`${this.baseURL}/guest/prices`, {
				headers: { Accept: "application/json" },
				params: { product },
			});
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get prices for a specific country and product combination
	 * @param {string} country - Country name
	 * @param {string} product - Product name
	 * @returns {Promise<any>} Pricing information for the country and product
	 * @static
	 */
	static async getPricesByCountryAndProduct(country: string, product: string): Promise<any> {
		try {
			const response = await axios.get(`${this.baseURL}/guest/prices`, {
				headers: { Accept: "application/json" },
				params: { country, product },
			});
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get notifications in specified language
	 * @param {Language} lang - Language code ('en' or 'ru')
	 * @returns {Promise<Notification>} Notification text
	 * @static
	 */
	static async getNotifications(lang: Language): Promise<Notification> {
		try {
			const response = await axios.get(`${this.baseURL}/guest/flash/${lang}`, {
				headers: { Accept: "application/json" },
			});
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get list of available countries
	 * @returns {Promise<Record<string, Country>>} List of countries with their information
	 * @static
	 */
	static async getCountries(): Promise<Record<string, Country>> {
		try {
			const response = await axios.get(`${this.baseURL}/guest/countries`, {
				headers: { Accept: "application/json" },
			});
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get user profile information
	 * @returns {Promise<UserProfile>} User profile data
	 */
	async getProfile(): Promise<UserProfile> {
		try {
			const response = await this.client.get("/user/profile");
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get order history
	 * @param {OrderHistoryOptions} options - Options for filtering and pagination
	 * @returns {Promise<{ Data: Order[]; ProductNames: string[]; Statuses: string[]; Total: number }>}
	 */
	async getOrderHistory(options: OrderHistoryOptions = {}): Promise<{
		Data: Order[];
		ProductNames: string[];
		Statuses: string[];
		Total: number;
	}> {
		try {
			const response = await this.client.get("/user/orders", { params: options });
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get payment history
	 * @param {PaginationOptions} options - Options for pagination
	 * @returns {Promise<{ Data: Payment[]; PaymentProviders: any[]; PaymentTypes: any[]; Total: number }>}
	 */
	async getPaymentHistory(options: PaginationOptions = {}): Promise<{
		Data: Payment[];
		PaymentProviders: any[];
		PaymentTypes: any[];
		Total: number;
	}> {
		try {
			const response = await this.client.get("/user/payments", { params: options });
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get list of price limits
	 * @returns {Promise<PriceLimit[]>} List of price limits
	 */
	async getPriceLimits(): Promise<PriceLimit[]> {
		try {
			const response = await this.client.get("/user/max-prices");
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Set price limit for a product
	 * @param {string} productName - Name of the product
	 * @param {number} price - Price limit
	 * @returns {Promise<any>} Result of the operation
	 */
	async setPriceLimit(productName: string, price: number): Promise<any> {
		try {
			const response = await this.client.post("/user/max-prices", {
				product_name: productName,
				price,
			});
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Delete price limit for a product
	 * @param {string} productName - Name of the product
	 * @returns {Promise<any>} Result of the operation
	 */
	async deletePriceLimit(productName: string): Promise<any> {
		try {
			const response = await this.client.delete("/user/max-prices", {
				data: { product_name: productName },
			});
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Buy activation number
	 * @param {string} country - Country name
	 * @param {string} operator - Operator name
	 * @param {string} product - Product name
	 * @param {BuyNumberOptions} options - Additional options
	 * @returns {Promise<Order>} Order details
	 */
	async buyActivationNumber(country: string, operator: string, product: string, options: BuyNumberOptions = {}): Promise<Order> {
		try {
			const response = await this.client.get(`/user/buy/activation/${country}/${operator}/${product}`, { params: options });
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Buy hosting number
	 * @param {string} country - Country name
	 * @param {string} operator - Operator name
	 * @param {string} product - Product name
	 * @returns {Promise<Order>} Order details
	 */
	async buyHostingNumber(country: string, operator: string, product: string): Promise<Order> {
		try {
			const response = await this.client.get(`/user/buy/hosting/${country}/${operator}/${product}`);
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Reuse a number
	 * @param {string} product - Product name
	 * @param {string} number - Phone number to reuse
	 * @returns {Promise<Order>} Order details
	 */
	async reuseNumber(product: string, number: string): Promise<Order> {
		try {
			const response = await this.client.get(`/user/reuse/${product}/${number}`);
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Check order status
	 * @param {number} id - Order ID
	 * @returns {Promise<Order>} Order details
	 */
	async checkOrder(id: number): Promise<Order> {
		try {
			const response = await this.client.get(`/user/check/${id}`);
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Finish an order
	 * @param {number} id - Order ID
	 * @returns {Promise<Order>} Order details
	 */
	async finishOrder(id: number): Promise<Order> {
		try {
			const response = await this.client.get(`/user/finish/${id}`);
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Cancel an order
	 * @param {number} id - Order ID
	 * @returns {Promise<Order>} Order details
	 */
	async cancelOrder(id: number): Promise<Order> {
		try {
			const response = await this.client.get(`/user/cancel/${id}`);
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Ban an order
	 * @param {number} id - Order ID
	 * @returns {Promise<Order>} Order details
	 */
	async banOrder(id: number): Promise<Order> {
		try {
			const response = await this.client.get(`/user/ban/${id}`);
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get SMS inbox for an order
	 * @param {number} id - Order ID
	 * @returns {Promise<{ Data: SMS[]; Total: number }>} SMS messages
	 */
	async getSMSInbox(id: number): Promise<{ Data: SMS[]; Total: number }> {
		try {
			const response = await this.client.get(`/user/sms/inbox/${id}`);
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get vendor profile
	 * @returns {Promise<VendorProfile>} Vendor profile details
	 */
	async getVendorProfile(): Promise<VendorProfile> {
		try {
			const response = await this.client.get("/user/vendor");
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get vendor wallet balances
	 * @returns {Promise<VendorWallets>} Wallet balances
	 */
	async getVendorWallets(): Promise<VendorWallets> {
		try {
			const response = await this.client.get("/vendor/wallets");
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get vendor order history
	 * @param {OrderHistoryOptions} options - Options for filtering and pagination
	 * @returns {Promise<{ Data: Order[]; ProductNames: string[]; Statuses: string[]; Total: number }>}
	 */
	async getVendorOrders(options: OrderHistoryOptions = {}): Promise<{
		Data: Order[];
		ProductNames: string[];
		Statuses: string[];
		Total: number;
	}> {
		try {
			const response = await this.client.get("/vendor/orders", { params: options });
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get vendor payment history
	 * @param {PaginationOptions} options - Options for pagination
	 * @returns {Promise<{ Data: Payment[]; PaymentProviders: any[]; PaymentStatuses: any[]; PaymentTypes: any[]; Total: number }>}
	 */
	async getVendorPayments(options: PaginationOptions = {}): Promise<{
		Data: Payment[];
		PaymentProviders: any[];
		PaymentStatuses: any[];
		PaymentTypes: any[];
		Total: number;
	}> {
		try {
			const response = await this.client.get("/vendor/payments", { params: options });
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Create a payout request
	 * @param {string} receiver - Receiver identifier
	 * @param {PayoutMethod} method - Payment method
	 * @param {string} amount - Amount to withdraw
	 * @param {FeeSystem} fee - Fee system to use
	 * @returns {Promise<any>} Result of the operation
	 */
	async createPayout(receiver: string, method: PayoutMethod, amount: string, fee: FeeSystem): Promise<any> {
		try {
			const response = await this.client.post("/vendor/withdraw", {
				receiver,
				method,
				amount,
				fee,
			});
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}
}
