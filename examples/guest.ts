import { FiveSimAPI } from "../src";

async function guestExamples() {
	try {
		// Get products for a specific country and operator
		const products = await FiveSimAPI.getProducts("russia", "any");
		console.log("Available Products:", products);

		// Get all prices
		const prices = await FiveSimAPI.getPrices();
		console.log("All Prices:", prices);

		// Get prices for a specific country
		const russianPrices = await FiveSimAPI.getPricesByCountry("russia");
		console.log("Russian Prices:", russianPrices);

		// Get prices for a specific product
		const telegramPrices = await FiveSimAPI.getPricesByProduct("telegram");
		console.log("Telegram Prices:", telegramPrices);

		// Get prices for specific country and product
		const russianTelegramPrices = await FiveSimAPI.getPricesByCountryAndProduct("russia", "telegram");
		console.log("Russian Telegram Prices:", russianTelegramPrices);

		// Get notifications
		const notificationsEn = await FiveSimAPI.getNotifications("en");
		console.log("English Notifications:", notificationsEn);

		const notificationsRu = await FiveSimAPI.getNotifications("ru");
		console.log("Russian Notifications:", notificationsRu);

		// Get list of countries
		const countries = await FiveSimAPI.getCountries();
		console.log("Available Countries:", countries);
	} catch (error) {
		console.error("Error:", error);
	}
}

// Run the examples
guestExamples();
