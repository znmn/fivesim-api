import axios, { AxiosInstance } from "axios";
import { createError } from "../utils/error";
import { GuestService } from "./guest.service";
import {
	UserProfile,
	Order,
	OrderHistoryResponse,
	PaymentHistoryResponse,
	PriceLimit,
	SMSInboxResponse,
	VendorProfile,
	VendorWallets,
	VendorOrdersResponse,
	VendorPaymentsResponse,
	SuccessResponse,
	OperatorPricing,
} from "../interfaces/responses";
import { OrderHistoryOptions, PaginationOptions, BuyNumberOptions, SetPriceLimitParams, DeletePriceLimitParams, PayoutMethod, FeeSystem, Country, Operator } from "../interfaces/types";

export class UserService {
	private readonly client: AxiosInstance;
	private static readonly baseURL: string = "https://5sim.net/v1";

	constructor(token: string) {
		if (!token) {
			throw new Error("API token is required");
		}

		this.client = axios.create({
			baseURL: UserService.baseURL,
			headers: {
				Authorization: `Bearer ${token}`,
				Accept: "application/json",
			},
		});
	}

	/**
	 * Wait for order status to become RECEIVED
	 * @private
	 */
	private async waitForOrderReceived(orderId: number): Promise<Order> {
		while (true) {
			const order = await this.checkOrder(orderId);
			if (order.status === "RECEIVED") {
				return order;
			}
			if (order.status !== "PENDING") {
				throw new Error(`Order failed with status: ${order.status}`);
			}
			await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait 1 second
		}
	}

	/**
	 * Find the best operator based on lowest cost and highest count
	 * @private
	 */
	private async findBestOperator(country: Country, product: string): Promise<string> {
		const prices = await GuestService.getPricesByCountryAndProduct(country, product);
		const countryData = prices[country.toLowerCase()];
		if (!countryData || !countryData[product]) {
			throw new Error(`No pricing data found for ${country}/${product}`);
		}

		const operators = Object.entries<OperatorPricing>(countryData[product]);
		if (operators.length === 0) {
			throw new Error(`No operators available for ${country}/${product}`);
		}

		// Sort by cost (ascending) and then by count (descending)
		operators.sort(([, a], [, b]) => {
			if (a.cost === b.cost) {
				return (b.count || 0) - (a.count || 0); // Higher count first, default to 0 if undefined
			}
			return (a.cost || 0) - (b.cost || 0); // Lower cost first, default to 0 if undefined
		});

		return operators[0][0]; // Return the operator name
	}

	/**
	 * Get user profile information
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
	 * Get order history with filtering options
	 */
	async getOrderHistory(options: OrderHistoryOptions = {}): Promise<OrderHistoryResponse> {
		try {
			const response = await this.client.get("/user/orders", { params: options });
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get payment history with pagination
	 */
	async getPaymentHistory(options: PaginationOptions = {}): Promise<PaymentHistoryResponse> {
		try {
			const response = await this.client.get("/user/payments", { params: options });
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get list of price limits
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
	 */
	async setPriceLimit(params: SetPriceLimitParams): Promise<SuccessResponse> {
		try {
			const response = await this.client.post("/user/max-prices", params);
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Delete price limit for a product
	 */
	async deletePriceLimit(params: DeletePriceLimitParams): Promise<SuccessResponse> {
		try {
			const response = await this.client.delete("/user/max-prices", {
				data: params,
			});
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Buy activation number
	 */
	async buyActivationNumber(country: Country, operator: Operator, product: string, options: BuyNumberOptions = {}): Promise<Order> {
		try {
			const { wait = false, ...restOptions } = options;
			const actualOperator = operator === "best" ? await this.findBestOperator(country, product) : operator;

			const response = await this.client.get(`/user/buy/activation/${country}/${actualOperator}/${product}`, { params: restOptions });
			let order = response.data;

			if (wait) {
				order = await this.waitForOrderReceived(order.id);
			}

			return order;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Buy hosting number
	 */
	async buyHostingNumber(country: Country, operator: Operator, product: string, options: BuyNumberOptions = {}): Promise<Order> {
		try {
			const { wait = false } = options;
			const actualOperator = operator === "best" ? await this.findBestOperator(country, product) : operator;

			const response = await this.client.get(`/user/buy/hosting/${country}/${actualOperator}/${product}`);
			let order = response.data;

			if (wait) {
				order = await this.waitForOrderReceived(order.id);
			}

			return order;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Reuse a number
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
	 * Check order status and get SMS messages
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
	 */
	async getSMSInbox(id: number): Promise<SMSInboxResponse> {
		try {
			const response = await this.client.get(`/user/sms/inbox/${id}`);
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get vendor profile
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
	 */
	async getVendorOrders(options: OrderHistoryOptions = {}): Promise<VendorOrdersResponse> {
		try {
			const response = await this.client.get("/vendor/orders", { params: options });
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Get vendor payment history
	 */
	async getVendorPayments(options: PaginationOptions = {}): Promise<VendorPaymentsResponse> {
		try {
			const response = await this.client.get("/vendor/payments", { params: options });
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}

	/**
	 * Create a payout request
	 */
	async createPayout(receiver: string, method: PayoutMethod, amount: string, fee: FeeSystem): Promise<SuccessResponse> {
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
