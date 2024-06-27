import { createAsyncThunk } from "@reduxjs/toolkit";
const dotenv = require("dotenv");
dotenv.config();
const BASE_URL = process.env.DEV_URL || "";
export const getInvetryProducts = createAsyncThunk(
	"InventryProduct/getInvetryProducts",
	async (thunkAPI) => {
		try {
			const response = await fetch(`${BASE_URL}/api/products/getproduct`, {
				cache: "no-cache"
			});
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
				`${process.env.DEV_URL}/api/products/getproduct?category=${payload}`,
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
