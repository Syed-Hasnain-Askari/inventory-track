import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInvetryProductsByManufacture } from "../slice/inventrySlice";
const dotenv = require("dotenv");
dotenv.config();
const BASE_URL = process.env.DEV_URL || "";
export const getManufacture = createAsyncThunk(
	"Manufacture/getManufacture",
	async (thunkAPI) => {
		try {
			const response = await fetch(
				`${BASE_URL}/api/manufacture/get-manufacture`,
				{
					next: { revalidate: 3600 }
				}
			);
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
				`${BASE_URL}/api/manufacture/get-manufacturebyname?search=${query}`,
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
export const addManufacture = createAsyncThunk(
	"Manufacture/addManufacture",
	async (payload, thunkAPI) => {
		try {
			const response = await fetch(
				`${BASE_URL}/api/manufacture/add-manufacture`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(payload),
					cache: "no-cache"
				}
			);
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
				`${BASE_URL}/api/manufacture/delete-manufacture/${id}`,
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
