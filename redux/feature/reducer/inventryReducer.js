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
