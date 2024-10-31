import { createAsyncThunk } from "@reduxjs/toolkit";
const BASE_URL = process.env.DEV_URL || "";
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
export const getManufactureByName = createAsyncThunk(
	"Manufacture/getManufactureByName",
	async (query, thunkAPI) => {
		try {
			const response = await fetch(
				`/api/manufacture/get-manufacturebyname?search=${query}`
			);
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
export const addManufacture = createAsyncThunk(
	"Manufacture/addManufacture",
	async (payload, thunkAPI) => {
		try {
			const response = await fetch(`/api/manufacture`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json"
				},
				body: JSON.stringify(payload)
			});
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
export const deleteManufacture = createAsyncThunk(
	"Manufacture/deleteManufacture",
	async (id, thunkAPI) => {
		try {
			const response = await fetch(
				`/api/manufacture/delete-manufacture/${id}`,
				{
					method: "DELETE"
				}
			);
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
