import { createAsyncThunk } from "@reduxjs/toolkit";
const dotenv = require("dotenv");
dotenv.config();
export const getInventoryProducts = createAsyncThunk(
	"InventoryProduct/getInventoryProducts",
	async (payload, thunkAPI) => {
		console.log(payload, "payload");
		const { search, category, manufacture, page = 1, limit = 10 } = payload; // Default page is 1 and limit is 10
		try {
			// Building query params
			const queryParams = new URLSearchParams();
			if (search) queryParams.append("search", search);
			if (category) queryParams.append("category", category);
			if (manufacture) queryParams.append("manufacture", manufacture);
			queryParams.append("page", page); // Add page number to query params
			queryParams.append("limit", limit); // Add limit to query params if needed
			// Make the request
			const response = await fetch(`/api/products/?${queryParams.toString()}`);
			// Parse the response
			return await response.json();
		} catch (error) {
			console.log(error.response, "error====");
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
export const addProduct = createAsyncThunk(
	"InventryProduct/addProduct",
	async (payload, thunkAPI) => {
		try {
			// 1. First, create the product without the image
			const productResponse = await fetch(`/api/products/`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(payload)
			});
			if (!productResponse.ok) {
				throw new Error("Failed to save product data. Please try again.");
			}
			// Get the product data (including the _id)
			return await productResponse.json();
		} catch (error) {
			console.log(error, "error");
			return thunkAPI.rejectWithValue(error.message);
		}
	}
);

export const updateProductById = createAsyncThunk(
	"InventryProduct/updateProductById",
	async (payload, thunkAPI) => {
		try {
			console.log(payload, "payload");
			const { _id, userInpt } = payload;
			const response = await fetch(`/api/products/${_id}`, {
				method: "PATCH",
				body: JSON.stringify(userInpt)
			});
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
export const deleteProductById = createAsyncThunk(
	"InventryProduct/deleteProductById",
	async (id, thunkAPI) => {
		try {
			const response = await fetch(`/api/products/${id}`, {
				method: "DELETE"
			});
			if (response.status === 204) {
				return { id }; // No content, just return the ID that was deleted
			} else {
				return rejectWithValue("Failed to delete the product");
			}
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
export const generalSearch = createAsyncThunk(
	"InventryProduct/generalSearch",
	async (search, thunkAPI) => {
		try {
			console.log(payload, "payload");
			const response = await fetch(`/api/products/?search=${search}`);
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
