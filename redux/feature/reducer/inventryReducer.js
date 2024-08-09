import { createAsyncThunk } from "@reduxjs/toolkit";
const dotenv = require("dotenv");
dotenv.config();
const BASE_URL = process.env.DEV_URL || "";
export const getInvetryProducts = createAsyncThunk(
	"InventryProduct/getInvetryProducts",
	async (thunkAPI) => {
		try {
			const response = await fetch(`/api/products/getproduct`, {
				next: { revalidate: 3600 }
			});
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
export const getInvetryProductsByCategory = createAsyncThunk(
	"InventryProduct/getInvetryProductsByCategory",
	async (payload, thunkAPI) => {
		try {
			const response = await fetch(
				`/api/products/getproduct?category=${payload}`,
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
export const getInvetryProductsByManufacture = createAsyncThunk(
	"InventryProduct/getInvetryProductsByManufacture",
	async (payload, thunkAPI) => {
		try {
			const response = await fetch(
				`/api/products/get-productsbymanufacture?manufacture=${payload}`,
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
