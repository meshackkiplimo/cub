import { version } from "react";

import storage from "redux-persist/lib/storage"; // defaults to localStorage for web
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { UserApi } from "../Features/users/userApi";
import { persistReducer } from "redux-persist";
import { persistStore } from "redux-persist";
import { loginAPI } from "../Features/users/logiApi";
import userSlice from "../Features/login/userSlice";
import { carAPI } from "../Features/cars/carApi";
import { bookingAPI } from "../Features/bookings/bookingAPI";


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
};

const rootReducer = combineReducers({
    [UserApi.reducerPath]:UserApi.reducer,
    [loginAPI.reducerPath]:loginAPI.reducer,
    [carAPI.reducerPath]:carAPI.reducer,
    [bookingAPI.reducerPath]:bookingAPI.reducer,
    user:userSlice




})
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer:persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }).concat(UserApi.middleware)
          .concat(loginAPI.middleware)
          .concat(carAPI.middleware)
            .concat(bookingAPI.middleware),
            



})

export const persistor = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;