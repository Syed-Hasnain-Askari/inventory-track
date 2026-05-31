import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { inventryProductSlice } from "../feature/slice/inventrySlice";
import { authSlice } from "../feature/slice/authSlice";
import { categorySlice } from "../feature/slice/categorySlice";
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
import { productSlice } from "../feature/slice/productSlice";
const persistConfig = {
	key: "root",
	storage,
	whitelist: ["auth"] // only navigation will be persisted
};
export const rootReducer = combineReducers({
	auth: authSlice.reducer,
	inventry: inventryProductSlice.reducer,
	product: productSlice.reducer,
	category: categorySlice.reducer,
	global: globalSlice.reducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
	reducer: persistedReducer,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: {
				ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER]
			}
		})
});
export const persistor = persistStore(store);
