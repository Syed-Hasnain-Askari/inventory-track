import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { inventryProductSlice } from "../feature/slice/inventrySlice";
import { categorySlice } from "../feature/slice/categorySlice";
import { manufactureSlice } from "../feature/slice/manufactureSlice";

// Extract the reducer from the slice
const rootReducer = combineReducers({
	inventry: inventryProductSlice.reducer,
	category: categorySlice.reducer,
	manufacture: manufactureSlice.reducer
});
export const store = configureStore({
	reducer: rootReducer
});
