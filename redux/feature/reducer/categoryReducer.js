import { createAsyncThunk } from "@reduxjs/toolkit";
import { BASE_URL } from "../../../lib/config";

export const getCategories = createAsyncThunk(
	"Category/getCategories",
	async (thunkAPI) => {
		try {
			const response = await fetch(`${BASE_URL}/api/categories`, {
				next: { revalidate: 3600 }
			});
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
