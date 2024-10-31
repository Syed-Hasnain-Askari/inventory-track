import { createAsyncThunk } from "@reduxjs/toolkit";
export const login = createAsyncThunk(
	"Auth/login",
	async (payload, thunkAPI) => {
		const { email, password } = payload;
		try {
			const response = await fetch(`/api/auth/login`, {
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify({ email, password })
			});
			console.log(response.json());
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
