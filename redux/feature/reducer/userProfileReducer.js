import { createAsyncThunk } from "@reduxjs/toolkit";
export const getManufacture = createAsyncThunk(
	"Manufacture/getManufacture",
	async (thunkAPI) => {
		try {
			const response = await fetch(`/api/manufacture`, {
				next: { revalidate: 3600 }
			});
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
