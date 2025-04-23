import { FiveSimAPI, BuyNumberOptions, OrderHistoryOptions } from "../src";

async function userExamples() {
	// Initialize with your API token
	const api = new FiveSimAPI("your-api-token");

	try {
		// Get user profile
		const profile = await api.getProfile();
		console.log("User Profile:", profile);

		// Get order history
		const orderOptions: OrderHistoryOptions = {
			category: "activation",
			limit: 10,
			offset: 0,
			order: "id",
			reverse: true,
		};
		const orders = await api.getOrderHistory(orderOptions);
		console.log("Order History:", orders);

		// Buy activation number
		const buyOptions: BuyNumberOptions = {
			forwarding: false,
			reuse: "0",
			voice: "0",
		};
		const newOrder = await api.buyActivationNumber("russia", "any", "telegram", buyOptions);
		console.log("New Order:", newOrder);

		// Check order status
		const orderStatus = await api.checkOrder(newOrder.id);
		console.log("Order Status:", orderStatus);

		// Get SMS inbox for the order
		const smsInbox = await api.getSMSInbox(newOrder.id);
		console.log("SMS Inbox:", smsInbox);

		// Get payment history
		const payments = await api.getPaymentHistory({
			limit: 10,
			offset: 0,
		});
		console.log("Payment History:", payments);

		// Price limits operations
		const priceLimits = await api.getPriceLimits();
		console.log("Price Limits:", priceLimits);

		await api.setPriceLimit("telegram", 10);
		console.log("Set price limit for telegram");

		await api.deletePriceLimit("telegram");
		console.log("Deleted price limit for telegram");

		// Buy hosting number
		const hostingOrder = await api.buyHostingNumber("russia", "any", "1day");
		console.log("Hosting Order:", hostingOrder);

		// Reuse number
		const reusedOrder = await api.reuseNumber("telegram", "79001234567");
		console.log("Reused Number:", reusedOrder);

		// Order management
		await api.finishOrder(newOrder.id);
		console.log("Finished order");

		// Vendor operations
		const vendorProfile = await api.getVendorProfile();
		console.log("Vendor Profile:", vendorProfile);

		const wallets = await api.getVendorWallets();
		console.log("Vendor Wallets:", wallets);

		const vendorOrders = await api.getVendorOrders({
			category: "activation",
			limit: 10,
		});
		console.log("Vendor Orders:", vendorOrders);

		const vendorPayments = await api.getVendorPayments({
			limit: 10,
		});
		console.log("Vendor Payments:", vendorPayments);

		// Create payout
		await api.createPayout(
			"1234567890", // receiver
			"qiwi", // method
			"100", // amount
			"unitpay" // fee system
		);
		console.log("Created payout request");
	} catch (error) {
		console.error("Error:", error);
	}
}

// Run the examples
userExamples();

// Example of error handling
async function errorHandlingExample() {
	const api = new FiveSimAPI("invalid-token");

	try {
		await api.getProfile();
	} catch (error: any) {
		if (error.status === 401) {
			console.error("Authentication failed. Please check your API token.");
		} else if (error.status === 429) {
			console.error("Rate limit exceeded. Please slow down your requests.");
		} else {
			console.error("An error occurred:", error.message);
		}
	}
}

// Run error handling example
errorHandlingExample();
