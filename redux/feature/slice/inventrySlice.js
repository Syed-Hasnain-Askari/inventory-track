import { createSlice } from "@reduxjs/toolkit";
import {
	generalSearch,
	getInventoryProducts,
	updateProductById
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
				inventryProducts: action.payload.result
			};
		}
	},
	extraReducers: (builder) => {
		//get inventry products
		builder.addCase(getInventoryProducts.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getInventoryProducts.fulfilled, (state, action) => {
			state.isLoading = false;
			state.inventryProducts = action.payload.result;
		});
		builder.addCase(getInventoryProducts.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.error = action.payload;
		});
		//update inventry products
		builder.addCase(updateProductById.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(updateProductById.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			const index = state.inventryProducts.findIndex(
				(product) => product._id === action.meta.arg._id
			);
			if (index !== -1) {
				// Update the item at the found index
				state.inventryProducts[index] = {
					...state.inventryProducts[index],
					...action.payload.result // Assuming the updated product details are in action.payload
				};
			}
		});
		builder.addCase(updateProductById.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.error = action.payload;
		});
		//general search response
		builder.addCase(generalSearch.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(generalSearch.fulfilled, (state, action) => {
			console.log(action.payload);
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
