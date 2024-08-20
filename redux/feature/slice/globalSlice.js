import { createSlice } from "@reduxjs/toolkit";
const initialState = {
	isSidebarCollapsed: false,
	isDarkMode: false,
	isGrid: false
};
export const globalSlice = createSlice({
	name: "global",
	initialState,
	reducers: {
		setIsSidebarCollapsed: (state, action) => {
			state.isSidebarCollapsed = action.payload;
		},
		setIsDarkMode: (state, action) => {
			state.isDarkMode = action.payload;
		},
		setIsGrid: (state, action) => {
			state.isGrid = action.payload;
		}
	}
});
export const { setIsSidebarCollapsed, setIsDarkMode, setIsGrid } =
	globalSlice.actions;
export default globalSlice.reducer;
