import { createAsyncThunk } from "@reduxjs/toolkit";
export const getProducts = createAsyncThunk(
	"Products/getProducts",
	async (params, thunkAPI) => {
		try {
			const response = await fetch(
				`${process.env.BASE_URL}/api/products?${params}`,
				{
					next: { revalidate: 3600 }
				}
			);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
