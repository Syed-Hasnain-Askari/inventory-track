import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";

// Import your slices
import authSlice from "../features/auth/auth.slice";
import incomeSlice from "../features/income/income.slice";
import expenseSlice from "../features/expense/expense.slice";
import goalSlice from "../features/goal.slice";

const rootReducer = combineReducers({
	auth: authSlice,
	income: incomeSlice,
	expense: expenseSlice,
	goal: goalSlice
});

export const store = configureStore({
	reducer: rootReducer
});
