# fivesim-api

Wrapper Node.js dengan dukungan TypeScript untuk API [5sim.net](https://5sim.net) - layanan verifikasi SMS.

[![GitHub](https://img.shields.io/github/license/znmn/fivesim-api)](https://github.com/znmn/fivesim-api/blob/main/LICENSE)

[🇬🇧 English](README.md)

## Instalasi

Dengan npm:

```bash
npm install fivesim-api
```

Dengan Yarn:

```bash
yarn add fivesim-api
```

Dengan Bun:

```bash
bun add fivesim-api
```

## Fitur

- 🎯 Dukungan TypeScript lengkap dengan definisi tipe yang komprehensif
- 🛡️ Penanganan error yang kuat dengan tipe error khusus
- 📚 Cakupan API lengkap dengan dokumentasi JSDoc
- ⚡ Method otentikasi dan guest dalam satu kelas
- 🔄 API berbasis Promise dengan async/await
- 📝 Pesan error detail untuk memudahkan debugging
- 🎯 Fitur terbaru:
  - Opsi operator `best`: Secara otomatis memilih operator dengan biaya terendah dan ketersediaan tertinggi
  - Opsi `wait`: Menunggu hingga status pesanan menjadi "RECEIVED" (pengecekan setiap 1 detik)

## Penggunaan

### TypeScript

```typescript
import { FiveSimAPI, BuyNumberOptions, Order, FiveSimError } from "fivesim-api";

// Method guest (tidak perlu otentikasi)
try {
	// Mendapatkan produk yang tersedia
	const products = await FiveSimAPI.getProducts("indonesia", "any");

	// Mendapatkan notifikasi
	const notifications = await FiveSimAPI.getNotifications("en");

	// Mendapatkan daftar negara
	const countries = await FiveSimAPI.getCountries();
} catch (error) {
	if (error instanceof FiveSimError) {
		console.error(`API Error ${error.status}: ${error.message}`);
	}
}

// Method dengan otentikasi
const api = new FiveSimAPI("your-api-token");

// Membeli nomor aktivasi dengan tipe TypeScript
const buyNumber = async () => {
	try {
		const options: BuyNumberOptions = {
			forwarding: false,
			reuse: "0",
			voice: "0",
		};

		// Menggunakan operator 'best' untuk mendapatkan harga termurah dengan ketersediaan terbanyak
		const number: Order = await api.buyActivationNumber("indonesia", "best", "telegram", {
			...options,
			wait: true, // Menunggu hingga nomor siap
		});

		console.log(number);
	} catch (error) {
		if (error instanceof FiveSimError) {
			console.error(`API Error ${error.status}: ${error.message}`);
		}
	}
};

// Operasi vendor dengan tipe yang sesuai
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

// Method guest (tidak perlu otentikasi)
FiveSimAPI.getProducts("indonesia", "any")
	.then((products) => console.log(products))
	.catch((error) => console.error(error));

// Method dengan otentikasi
const api = new FiveSimAPI("your-api-token");

// Mendapatkan profil pengguna
api
	.getProfile()
	.then((profile) => console.log(profile))
	.catch((error) => console.error(error));
```

## Menjalankan Contoh

Paket ini menyertakan kode contoh untuk penggunaan TypeScript dan JavaScript:

```bash
# Menjalankan contoh TypeScript
npm run example:guest-ts
npm run example:user-ts

# Menjalankan contoh JavaScript
npm run example:guest-js
npm run example:user-js
```

## Penanganan Error

Paket ini menyertakan tipe error khusus untuk penanganan error yang lebih baik:

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
	await api.buyActivationNumber("indonesia", "any", "telegram");
} catch (error) {
	if (error instanceof AuthenticationError) {
		// Menangani error otentikasi
	} else if (error instanceof NoPhoneNumbersError) {
		// Menangani tidak ada nomor tersedia
	} else if (error instanceof RateLimitError) {
		// Menangani batas rate
	}
}
```

## Method API

### Method Guest (Statis)

```typescript
FiveSimAPI.getProducts(country: string, operator: string)
FiveSimAPI.getPrices()
FiveSimAPI.getPricesByCountry(country: string)
FiveSimAPI.getPricesByProduct(product: string)
FiveSimAPI.getPricesByCountryAndProduct(country: string, product: string)
FiveSimAPI.getNotifications(lang: 'en' | 'ru')
FiveSimAPI.getCountries()
```

### Method User (Instance)

```typescript
const api = new FiveSimAPI('your-api-token');

// Profil
api.getProfile()

// Pesanan
api.getOrderHistory(options?: OrderHistoryOptions)
api.buyActivationNumber(country: string, operator: string, product: string, options?: BuyNumberOptions)
api.buyHostingNumber(country: string, operator: string, product: string)
api.reuseNumber(product: string, number: string)
api.checkOrder(id: number)
api.finishOrder(id: number)
api.cancelOrder(id: number)
api.banOrder(id: number)
api.getSMSInbox(id: number)

// Pembayaran
api.getPaymentHistory(options?: PaginationOptions)

// Batas Harga
api.getPriceLimits()
api.setPriceLimit(productName: string, price: number)
api.deletePriceLimit(productName: string)

// Operasi Vendor
api.getVendorProfile()
api.getVendorWallets()
api.getVendorOrders(options?: OrderHistoryOptions)
api.getVendorPayments(options?: PaginationOptions)
api.createPayout(receiver: string, method: PayoutMethod, amount: string, fee: FeeSystem)
```

## Types

Semua tipe TypeScript diekspor dan dapat diimpor:

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

## Batasan API

- 100 permintaan per detik per alamat IP (HTTP 503)
- 100 permintaan per detik per API_KEY (HTTP 429)
- 100 permintaan per detik untuk operasi pembelian nomor (HTTP 503)
- Jika permintaan mencapai batas dalam 10 menit sebanyak 5 kali, Anda akan diblokir selama 10 menit

## Lisensi

MIT © [Zainul Muhaimin](https://github.com/znmn)
