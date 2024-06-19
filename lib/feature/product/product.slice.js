import { createSlice } from "@reduxjs/toolkit";
import { getProducts } from "./productReducer";
const initialState = {
	products: [],
	isLoading: false,
	isSuccess: false,
	isError: false,
	error: null
};
export const productSlice = createSlice({
	name: "products",
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
		builder.addCase(getProducts.pending, (state) => {
			console.log(state, "getProducts.pending");
			state.isLoading = true;
			state.isError = false;
			state.isSuccess = false;
		});
		builder.addCase(getProducts.fulfilled, (state, action) => {
			console.log(action, "getProducts.fulfilled");
			state.isLoading = false;
			state.isError = false;
			state.isSuccess = true;
			state.products.push(...action.payload);
		});
		builder.addCase(getProducts.rejected, (state, action) => {
			console.log(action, "getProducts.rejected");
			state.isLoading = false;
			state.isError = true;
			state.isSuccess = false;
			state.error = action.error;
		});
	}
});
export const { clearState, clearSuccess } = productSlice.actions;
export default productSlice.reducer;
