import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";






export type TIBooking = {
    booking_id: number;
    customer_id: number;
    car_id: number
    rental_start_date: string;
    rental_end_date: string
    total_amount: number;
    status: 'pending' | 'confirmed' | 'cancelled';

}

export const bookingAPI = createApi({
    reducerPath: 'bookingApi',
    baseQuery: fetchBaseQuery({
        baseUrl: APIDomain,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as RootState).user.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        }
    }),
    tagTypes: ['Booking'],
    endpoints: (builder) => ({
        getBookings: builder.query<TIBooking[], void>({
            query: () => '/bookings',
            transformResponse: (response: { bookings: TIBooking[] }) => response.bookings,
            providesTags: ['Booking'],
        }),
        createBooking: builder.mutation<TIBooking, Partial<TIBooking>>({
            query: (newBooking) => ({
                url: '/bookings',
                method: 'POST',
                body: newBooking,
            }),
            invalidatesTags: ['Booking'],
        }),
        updateBookingStatus: builder.mutation<TIBooking, { id: number; status: string }>({
            query: ({ id, status }) => ({
                url: `/bookings/${id}`,
                method: 'PUT',
                body: { status },
            }),
            invalidatesTags: ['Booking'],
        }),
    }),

})