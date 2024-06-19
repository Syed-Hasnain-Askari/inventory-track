import { createAsyncThunk } from "@reduxjs/toolkit";
export const getProducts = createAsyncThunk(
	"products/getProducts",
	async (thunkAPI) => {
		try {
			const response = await fetch("http://localhost:3000/api/getcategories");
			const data = await response.json();
			return data;
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
