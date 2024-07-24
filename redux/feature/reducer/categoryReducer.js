import { createAsyncThunk } from "@reduxjs/toolkit";
const dotenv = require("dotenv");
dotenv.config();
const BASE_URL = process.env.DEV_URL || "";
export const getCategories = createAsyncThunk(
	"Category/getCategories",
	async (thunkAPI) => {
		try {
			const response = await fetch(`${BASE_URL}/api/getcategories`, {
				next: { revalidate: 3600 }
			});
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
