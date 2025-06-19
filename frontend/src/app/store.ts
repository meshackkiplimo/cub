import { version } from "react";

import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { UserApi } from "../Features/users/userApi";
import { persistReducer } from "redux-persist";
import { persistStore } from "redux-persist";


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const rootReducer = combineReducers({
    [UserApi.reducerPath]:UserApi.reducer



})
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(UserApi.middleware),

})
export const persistedStore = persistStore(store)
export type RootState = ReturnType<typeof store.getState>;