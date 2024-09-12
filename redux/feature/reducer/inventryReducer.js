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
			const response = await fetch(`/api/products/?${queryParams.toString()}`, {
				cache: "no-cache"
			});

			// Parse the response
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);

export const addProduct = createAsyncThunk(
	"InventryProduct/addProduct",
	async (payload, thunkAPI) => {
		try {
			console.log(payload, "payload");
			const response = await fetch(`/api/products/`, {
				cache: "no-cache",
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(payload)
			});
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
export const updateProductById = createAsyncThunk(
	"InventryProduct/updateProductById",
	async (payload, thunkAPI) => {
		try {
			console.log(payload, "payload");
			const response = await fetch(`/api/products/${payload._id}`, {
				method: "PATCH",
				body: JSON.stringify(payload.userInput)
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
			const response = await fetch(`/api/products/?search=${search}`, {
				cache: "no-cache"
			});
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
