import { createSlice } from "@reduxjs/toolkit";
import {
	addManufacture,
	deleteManufacture,
	getManufacture,
	getManufactureByName
} from "../reducer/manufactureReducer";
const initialState = {
	manufactures: [],
	manufactureList: [],
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
		},
		setManufacture: (state, action) => {
			return {
				...state,
				manufactures: action.payload
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
			state.manufactures = action.payload.result;
			state.manufactureList = action.payload.result;
		});
		builder.addCase(getManufacture.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.error = action.payload;
		});
		// Add the pending, fulfilled, and rejected cases for get manufacturebyname
		builder.addCase(getManufactureByName.pending, (state) => {
			state.isLoading = true;
		});
		builder.addCase(getManufactureByName.fulfilled, (state, action) => {
			state.isLoading = false;
			state.manufactures = action.payload.result;
		});
		builder.addCase(getManufactureByName.rejected, (state, action) => {
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
			state.manufactures = [...state.manufactures, action.payload.result];
		});
		builder.addCase(addManufacture.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.error = action.payload;
		});
		// Add the pending, fulfilled, and rejected cases for delete manufacture
		builder.addCase(deleteManufacture.pending, (state) => {
			state.isLoading = true;
			state.isSuccess = false;
		});
		builder.addCase(deleteManufacture.fulfilled, (state, action) => {
			console.log(action.payload, "delete=======");
			const index = state.manufactures?.findIndex(
				(manufacture) => manufacture._id === action?.payload?.result?._id
			);
			if (index !== -1) {
				state.manufactures?.splice(index, 1);
			}
			state.isLoading = false;
			state.isSuccess = true;
		});
		builder.addCase(deleteManufacture.rejected, (state, action) => {
			state.isLoading = false;
			state.isError = true;
			state.error = action.payload;
		});
	}
});
export const { clearState, clearSuccess, setManufacture } =
	manufactureSlice.actions;
export default manufactureSlice.reducer;
