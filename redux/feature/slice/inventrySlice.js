import { createSlice } from "@reduxjs/toolkit";
import {
	getInvetryProducts,
	getInvetryProductsByManufacture
} from "../reducer/inventryReducer";
const initialState = {
	inventryProducts: [],
	isLoading: false,
	isSuccess: false,
	isError: false,
	error: null
};
export const inventryProductSlice = createSlice({
	name: "InventryProduct",
	initialState,
	reducers: {
		clearState: () => initialState,
		clearSuccess: (state) => {
			return {
				...state,
				isSuccess: false
			};
		}
	},
	extraReducers: (builder) => {
		builder.addCase(getInvetryProducts.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getInvetryProducts.fulfilled, (state, action) => {
			state.isLoading = false;
			state.inventryProducts = action.payload;
		});
		builder.addCase(getInvetryProductsByManufacture.pending, (state) => {
			state.isLoading = true;
		});
	}
});
export const { clearState, clearSuccess } = inventryProductSlice.actions;
export default inventryProductSlice.reducer;
