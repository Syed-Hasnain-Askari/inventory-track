import { createSlice } from "@reduxjs/toolkit";
import { getCategories } from "../reducer/categoryReducer";
const initialState = {
	categories: [],
	isLoading: false,
	isSuccess: false,
	isError: false,
	error: null
};
export const categorySlice = createSlice({
	name: "Category",
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
		builder
			.addCase(getCategories.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(getCategories.fulfilled, (state, action) => {
				state.isLoading = false;
				state.categories = action.payload;
			});
	}
});
export const { clearState, clearSuccess } = categorySlice.actions;
export default categorySlice.reducer;
