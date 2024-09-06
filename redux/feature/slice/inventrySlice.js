import { createSlice } from "@reduxjs/toolkit";
import {
	generalSearch,
	getInventoryProducts,
	updateProductById,
	deleteProductById,
	addProduct
} from "../reducer/inventryReducer";
const initialState = {
	inventryProducts: [],
	pagination: null,
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
				inventryProducts: action.payload.result,
				pagination: action.payload.pagination
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
			state.pagination = action.payload.pagination;
		});
		builder.addCase(getInventoryProducts.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.error = action.payload;
		});
		//add inventry products
		builder.addCase(addProduct.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(addProduct.fulfilled, (state, action) => {
			console.log("addProduct.fulfilled", action);
			state.isLoading = false;
			state.isSuccess = true;
			state.inventryProducts.unshift(action?.payload?.result);
		});
		builder.addCase(addProduct.rejected, (state, action) => {
			console.log("addProduct.rejected", action);
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
		//Delete product
		builder.addCase(deleteProductById.pending, (state) => {
			console.log(state.inventryProducts, "state.inventryProducts");
			state.isLoading = true;
		});
		builder.addCase(deleteProductById.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			// Extract the ID from the action meta (which was sent in the request)
			const deletedProductId = action.meta.arg;
			// Find the index of the product with the same ID in the state
			const index = state.inventryProducts.findIndex(
				(product) => product?._id === deletedProductId
			);
			// If the product is found, remove it from the array
			if (index !== -1) {
				state.inventryProducts.splice(index, 1);
			}
		});
		builder.addCase(deleteProductById.rejected, (state, action) => {
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
