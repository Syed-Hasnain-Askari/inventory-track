import { createAsyncThunk } from "@reduxjs/toolkit";
export const getCategories = createAsyncThunk(
	"Category/getCategories",
	async (thunkAPI) => {
		try {
			const response = await fetch("http://localhost:3000/api/getcategories", {
				cache: "no-cache"
			});
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
