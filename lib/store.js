import { configureStore } from "@reduxjs/toolkit";
import { productSlice } from "./feature/product/product.slice";
import { combineReducers } from "redux";
const rootReducer = combineReducers({
	product: productSlice
});
export function makeStore() {
	return configureStore({
		reducer: rootReducer
	});
}
export const store = makeStore();
