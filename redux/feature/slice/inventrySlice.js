import { createSlice } from "@reduxjs/toolkit";
import {
	generalSearch,
	getInvetryProducts,
	getInvetryProductsByCategory,
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
		},
		getProducts: (state, action) => {
			console.log(action.payload, "payload");
			return {
				...state,
				inventryProducts: action.payload
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
		builder.addCase(getInvetryProductsByCategory.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getInvetryProductsByCategory.fulfilled, (state, action) => {
			console.log(action, "getInvetryProductsByCategory.fulfilled");
			state.isLoading = false;
			state.inventryProducts = action.payload.result;
		});
		builder.addCase(getInvetryProductsByCategory.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.error = action.payload;
		});

		//search product by manufacture
		builder.addCase(getInvetryProductsByManufacture.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(
			getInvetryProductsByManufacture.fulfilled,
			(state, action) => {
				console.log(action, "getInvetryProductsByManufacture.fulfilled");
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
export const { clearState, clearSuccess, getProducts } =
	inventryProductSlice.actions;
export default inventryProductSlice.reducer;
