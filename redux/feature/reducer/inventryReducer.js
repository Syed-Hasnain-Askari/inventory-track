import { createAsyncThunk } from "@reduxjs/toolkit";
const dotenv = require("dotenv");
dotenv.config();
export const getInventoryProducts = createAsyncThunk(
	"InventoryProduct/getInventoryProducts",
	async (payload, thunkAPI) => {
		const { category, manufacture } = payload;
		try {
			const queryParams = new URLSearchParams();
			if (category) queryParams.append("category", category);
			if (manufacture) queryParams.append("manufacture", manufacture);
			const response = await fetch(`/api/products/?${queryParams.toString()}`, {
				cache: "no-cache"
			});
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
	async (payload, thunkAPI) => {
		try {
			console.log(payload, "payload");
			const response = await fetch(
				`/api/products/getproduct?search=${payload}`,
				{
					cache: "no-cache"
				}
			);
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
