import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { inventryProductSlice } from "../feature/slice/inventrySlice";
import { categorySlice } from "../feature/slice/categorySlice";
import { manufactureSlice } from "../feature/slice/manufactureSlice";
import { globalSlice } from "../feature/slice/globalSlice";
import { createWrapper } from "next-redux-wrapper";

// Extract the reducer from the slice
const rootReducer = combineReducers({
	inventry: inventryProductSlice.reducer,
	category: categorySlice.reducer,
	manufacture: manufactureSlice.reducer,
	global: globalSlice.reducer
});
export const store = configureStore({
	reducer: rootReducer
});
export const wrapper = createWrapper(store);
