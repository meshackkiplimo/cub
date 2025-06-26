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
import { reservationAPI } from "../Features/reservations/reservationAPI";


const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    whitelist: ['user'] // Specify which reducers to persist
};

const rootReducer = combineReducers({
    [UserApi.reducerPath]:UserApi.reducer,
    [loginAPI.reducerPath]:loginAPI.reducer,
    [carAPI.reducerPath]:carAPI.reducer,
    [bookingAPI.reducerPath]:bookingAPI.reducer,
    [reservationAPI.reducerPath]:reservationAPI.reducer,
    user: userSlice




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
            .concat(bookingAPI.middleware)
            .concat(reservationAPI.middleware),
            



})

export const persistedStore = persistStore(store);


export type RootState = ReturnType<typeof store.getState>;