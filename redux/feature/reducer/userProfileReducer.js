import { createAsyncThunk } from "@reduxjs/toolkit";
import { getInvetryProductsByManufacture } from "../slice/inventrySlice";
const dotenv = require("dotenv");
dotenv.config();
const BASE_URL = process.env.DEV_URL || "";
export const getManufacture = createAsyncThunk(
	"Manufacture/getManufacture",
	async (thunkAPI) => {
		try {
			const response = await fetch(`${BASE_URL}/api/manufacture`, {
				next: { revalidate: 3600 }
			});
			return await response.json();
		} catch (error) {
			return thunkAPI.rejectWithValue(error.response);
		}
	}
);
