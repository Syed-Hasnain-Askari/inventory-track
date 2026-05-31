import { createSlice } from "@reduxjs/toolkit";
import { deleteProduct, getProducts } from "../reducer/productReducer";
const initialState = {
	products: [],
	pagination: {
		currentPage: 1,
		totalPages: 1,
		totalProducts: 0,
		limit: 10
	},
	selectedProduct: null,
	isLoading: false,
	isSuccess: false,
	isError: false,
	error: null
};
export const productSlice = createSlice({
	name: "Product",
	initialState,
	reducers: {
		clearState: () => initialState,
		clearSuccess: (state) => {
			return {
				...state,
				isSuccess: false
			};
		},
		setProducts: (state, action) => {
			state.items = action.payload.items;
			state.pagination = action.payload.pagination;
		},
		setSelectedProduct: (state, action) => {
			state.selectedProduct = action.payload;
		}
	},
	extraReducers: (builder) => {
		// Add the pending, fulfilled, and rejected cases for get products
		builder.addCase(getProducts.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getProducts.fulfilled, (state, action) => {
			state.isLoading = false;
			state.isSuccess = true;
			state.products = action.payload.result || [];
			state.pagination = action.payload.pagination || initialState.pagination;
		});
		builder.addCase(getProducts.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.error = action.payload;
		});
		// Delete Product cases
		builder
			.addCase(deleteProduct.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(deleteProduct.fulfilled, (state, action) => {
				state.isLoading = false;
				state.isSuccess = true;
				state.items = state.items.filter((item) => item._id !== action.payload);
				state.pagination.totalProducts -= 1;
			})
			.addCase(deleteProduct.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.error = action.payload;
			});
	}
});

export const { clearState, clearSuccess, setProducts, setSelectedProduct } =
	productSlice.actions;
export default productSlice.reducer;
