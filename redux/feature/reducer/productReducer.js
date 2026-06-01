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
// Async thunk for product deletion
export const deleteProduct = createAsyncThunk(
	"products/deleteProduct",
	async (productId, { rejectWithValue }) => {
		try {
			const response = await fetch(
				`${process.env.BASE_URL}/api/products/${productId}`,
				{
					method: "DELETE",
					credentials: "include"
				}
			);

			if (!response.ok) {
				throw new Error(`Failed to delete product: ${response.status}`);
			}

			return productId;
		} catch (error) {
			return rejectWithValue(error.message);
		}
	}
);
