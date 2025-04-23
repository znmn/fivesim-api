import axios from "axios";
import { createError } from "../utils/error";
import { Language, Country, Operator } from "../interfaces/types";
import { ProductsResponse, PricesResponse, CountriesResponse, NotificationResponse } from "../interfaces/responses";

export class GuestService {
	private static readonly baseURL: string = "https://5sim.net/v1";

	/**
	 * Get available products for a specific country and operator
	 */
	static async getProducts(country: Country, operator: Operator): Promise<ProductsResponse> {
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
	 */
	static async getPrices(): Promise<PricesResponse> {
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
	 */
	static async getPricesByCountry(country: Country): Promise<PricesResponse> {
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
	 */
	static async getPricesByProduct(product: string): Promise<PricesResponse> {
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
	 */
	static async getPricesByCountryAndProduct(country: Country, product: string): Promise<PricesResponse> {
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
	 */
	static async getNotifications(lang: Language): Promise<NotificationResponse> {
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
	 */
	static async getCountries(): Promise<CountriesResponse> {
		try {
			const response = await axios.get(`${this.baseURL}/guest/countries`, {
				headers: { Accept: "application/json" },
			});
			return response.data;
		} catch (error) {
			throw createError(error);
		}
	}
}
