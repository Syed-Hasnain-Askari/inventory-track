import { createAsyncThunk } from "@reduxjs/toolkit";
export const getCategories = createAsyncThunk(
	"Category/getCategories",
	async (thunkAPI) => {
		try {
			const response = await fetch(`/api/getcategories`, {
				next: { revalidate: 3600 }
			});
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
