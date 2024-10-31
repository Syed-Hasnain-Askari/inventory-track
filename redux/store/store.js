import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { inventryProductSlice } from "../feature/slice/inventrySlice";
import { authSlice } from "../feature/slice/authSlice";
import { categorySlice } from "../feature/slice/categorySlice";
import { manufactureSlice } from "../feature/slice/manufactureSlice";
import { globalSlice } from "../feature/slice/globalSlice";
import {
	persistStore,
	persistReducer,
	FLUSH,
	REHYDRATE,
	PAUSE,
	PERSIST,
	PURGE,
	REGISTER
} from "redux-persist";
import storage from "redux-persist/lib/storage";
const persistConfig = {
	key: "root",
	storage,
	whitelist: ["auth"] // only navigation will be persisted
};
export const rootReducer = combineReducers({
	auth: authSlice.reducer,
	inventry: inventryProductSlice.reducer,
	category: categorySlice.reducer,
	manufacture: manufactureSlice.reducer,
	global: globalSlice.reducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
	reducer: persistedReducer
});
export const persistor = persistStore(store);
