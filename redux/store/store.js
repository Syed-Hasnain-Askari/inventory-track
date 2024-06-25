import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { inventryProductSlice } from "../feature/slice/inventrySlice";
import { categorySlice } from "../feature/slice/categorySlice";

// Extract the reducer from the slice
const rootReducer = combineReducers({
	inventry: inventryProductSlice.reducer,
	category: categorySlice.reducer
});

export const store = configureStore({
	reducer: rootReducer
});
