import { createSlice } from "@reduxjs/toolkit";
import {
	generalSearch,
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
		//get inventry products
		builder.addCase(getInvetryProducts.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getInvetryProducts.fulfilled, (state, action) => {
			state.isLoading = false;
			state.inventryProducts = action.payload.result;
		});
		//search product by category
		builder.addCase(getInvetryProductsByManufacture.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(
			getInvetryProductsByManufacture.fulfilled,
			(state, action) => {
				state.isLoading = false;
				state.inventryProducts = action.payload.result;
			}
		);
		builder.addCase(
			getInvetryProductsByManufacture.rejected,
			(state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.error = action.payload;
			}
		);
		//general search response
		builder.addCase(generalSearch.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(generalSearch.fulfilled, (state, action) => {
			state.isLoading = false;
			state.inventryProducts = action.payload.result;
		});
		builder.addCase(generalSearch.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.error = action.payload;
		});
	}
});
export const { clearState, clearSuccess } = inventryProductSlice.actions;
export default inventryProductSlice.reducer;
