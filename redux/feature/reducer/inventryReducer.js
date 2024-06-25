import { createAsyncThunk } from "@reduxjs/toolkit";
export const getInvetryProducts = createAsyncThunk(
	"InventryProduct/getInvetryProducts",
	async (thunkAPI) => {
		try {
			const response = await fetch(
				"http://localhost:3000/api/products/getproduct",
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
