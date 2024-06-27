import { createSlice } from "@reduxjs/toolkit";
import { addManufacture, getManufacture } from "../reducer/manufactureReducer";
const initialState = {
	manufactures: [],
	isLoading: false,
	isSuccess: false,
	isError: false,
	error: null
};
export const manufactureSlice = createSlice({
	name: "Manufacture",
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
		// Add the pending, fulfilled, and rejected cases for get manufacture
		builder.addCase(getManufacture.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getManufacture.fulfilled, (state, action) => {
			state.isLoading = false;
			state.manufactures = action.payload;
		});
		builder.addCase(getManufacture.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.error = action.payload;
		});
		// Add the pending, fulfilled, and rejected cases for add manufacture
		builder.addCase(addManufacture.pending, (state) => {
			state.isLoading = true;
			state.isSuccess = false;
		});
		builder.addCase(addManufacture.fulfilled, (state, action) => {
			console.log(action.payload);
			state.isLoading = false;
			state.isSuccess = true;
			state.manufactures.unshift(action.payload);
		});
		builder.addCase(addManufacture.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.error = action.payload;
		});
	}
});
export const { clearState, clearSuccess } = manufactureSlice.actions;
export default manufactureSlice.reducer;
