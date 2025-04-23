# fivesim-api

A strongly-typed Node.js wrapper for the [5sim.net](https://5sim.net) API - SMS verification service.

[![GitHub](https://img.shields.io/github/license/znmn/fivesim-api?style=flat)](https://github.com/znmn/fivesim-api/blob/main/LICENSE)

[🇮🇩 Bahasa Indonesia](README-ID.md)

## Installation

With npm:

```bash
npm install fivesim-api
```

With Yarn:

```bash
yarn add fivesim-api
```

With Bun:

```bash
bun add fivesim-api
```

## Features

- 🎯 Full TypeScript support with comprehensive type definitions
- 🛡️ Robust error handling with custom error types
- 📚 Complete API coverage with JSDoc documentation
- ⚡ Both authenticated and guest methods in a single class
- 🔄 Promise-based async/await API
- 📝 Detailed error messages for easier debugging

- 🎯 Latest features:
  - `best` operator option: Automatically selects operator with lowest cost and highest availability
  - `wait` option: Waits until order status becomes "RECEIVED" (checks every 1 second)

## Usage

### TypeScript

```typescript
import { FiveSimAPI, BuyNumberOptions, Order, FiveSimError } from "fivesim-api";

// Guest methods (no auth required)
try {
	// Get available products
	const products = await FiveSimAPI.getProducts("russia", "any");

	// Get notifications
	const notifications = await FiveSimAPI.getNotifications("en");

	// Get country list
	const countries = await FiveSimAPI.getCountries();
} catch (error) {
	if (error instanceof FiveSimError) {
		console.error(`API Error ${error.status}: ${error.message}`);
	}
}

// Authenticated methods
const api = new FiveSimAPI("your-api-token");

// Buy activation number with TypeScript types
const buyNumber = async () => {
	try {
		const options: BuyNumberOptions = {
			forwarding: false,
			reuse: "0",
			voice: "0",
		};

		// Use 'best' operator to get cheapest price with most availability
		const number: Order = await api.buyActivationNumber("russia", "best", "telegram", {
			...options,
			wait: true, // Wait until number is ready
		});

		console.log(number);
	} catch (error) {
		if (error instanceof FiveSimError) {
			console.error(`API Error ${error.status}: ${error.message}`);
		}
	}
};

// Vendor operations with proper types
const vendorOps = async () => {
	try {
		const profile = await api.getVendorProfile();
		const wallets = await api.getVendorWallets();
		const orders = await api.getVendorOrders({
			category: "activation",
			limit: 15,
		});

		console.log({ profile, wallets, orders });
	} catch (error) {
		if (error instanceof FiveSimError) {
			console.error(`API Error ${error.status}: ${error.message}`);
		}
	}
};
```

### JavaScript

```javascript
const { FiveSimAPI } = require("fivesim-api");

// Guest methods (no auth required)
FiveSimAPI.getProducts("russia", "any")
	.then((products) => console.log(products))
	.catch((error) => console.error(error));

// Authenticated methods
const api = new FiveSimAPI("your-api-token");

// Get user profile
api
	.getProfile()
	.then((profile) => console.log(profile))
	.catch((error) => console.error(error));
```

## Running Examples

The package includes example code for both TypeScript and JavaScript usage:

```bash
# Run TypeScript examples
npm run example:guest-ts
npm run example:user-ts

# Run JavaScript examples
npm run example:guest-js
npm run example:user-js
```

## Error Handling

The package includes custom error types for better error handling:

```typescript
import {
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
} from "fivesim-api";

try {
	await api.buyActivationNumber("russia", "any", "telegram");
} catch (error) {
	if (error instanceof AuthenticationError) {
		// Handle authentication error
	} else if (error instanceof NoPhoneNumbersError) {
		// Handle no available numbers
	} else if (error instanceof RateLimitError) {
		// Handle rate limit
	}
}
```

## API Methods

### Guest Methods (Static)

```typescript
FiveSimAPI.getProducts(country: string, operator: string)
FiveSimAPI.getPrices()
FiveSimAPI.getPricesByCountry(country: string)
FiveSimAPI.getPricesByProduct(product: string)
FiveSimAPI.getPricesByCountryAndProduct(country: string, product: string)
FiveSimAPI.getNotifications(lang: 'en' | 'ru')
FiveSimAPI.getCountries()
```

### User Methods (Instance)

```typescript
const api = new FiveSimAPI('your-api-token');

// Profile
api.getProfile()

// Orders
api.getOrderHistory(options?: OrderHistoryOptions)
api.buyActivationNumber(country: string, operator: string, product: string, options?: BuyNumberOptions)
api.buyHostingNumber(country: string, operator: string, product: string)
api.reuseNumber(product: string, number: string)
api.checkOrder(id: number)
api.finishOrder(id: number)
api.cancelOrder(id: number)
api.banOrder(id: number)
api.getSMSInbox(id: number)

// Payments
api.getPaymentHistory(options?: PaginationOptions)

// Price Limits
api.getPriceLimits()
api.setPriceLimit(productName: string, price: number)
api.deletePriceLimit(productName: string)

// Vendor Operations
api.getVendorProfile()
api.getVendorWallets()
api.getVendorOrders(options?: OrderHistoryOptions)
api.getVendorPayments(options?: PaginationOptions)
api.createPayout(receiver: string, method: PayoutMethod, amount: string, fee: FeeSystem)
```

## Types

All TypeScript types are exported and can be imported:

```typescript
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
	PayoutMethod,
	FeeSystem,
	SMS,
} from "fivesim-api";
```

## API Limits

- 100 requests per second by IP address (HTTP 503)
- 100 requests per second by API_KEY (HTTP 429)
- 100 requests per second for buy number operations (HTTP 503)
- If requests reach limit within 10 minutes 5 times, you'll be banned for 10 minutes

## License

MIT © [Zainul Muhaimin](https://github.com/znmn)
