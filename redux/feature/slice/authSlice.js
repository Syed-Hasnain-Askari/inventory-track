import { createSlice } from "@reduxjs/toolkit";
import { login } from "../reducer/authReducer";
const initialState = {
	auth: [],
	isLoading: false,
	isSuccess: false,
	isError: false,
	error: null
};
export const authSlice = createSlice({
	name: "Auth",
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
			.addCase(login.pending, (state) => {
				state.isLoading = true;
			})
			.addCase(login.fulfilled, (state, action) => {
				state.isLoading = false;
				state.auth = action.payload;
			})
			.addCase(login.rejected, (state, action) => {
				state.isLoading = false;
				state.isError = true;
				state.error = action.payload;
			});
	}
});
export const { clearState, clearSuccess } = authSlice.actions;
export default authSlice.reducer;
