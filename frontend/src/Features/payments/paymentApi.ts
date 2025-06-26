import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";





export type TIPayment = {
     payment_id: number;
        user_id: number;
        booking_id: number;
        payment_date: string;
        amount: number;
        payment_method: string;
    
        user:{
            user_id: number;
            first_name: string;
            last_name: string;
            email: string;
        }

        booking: {
            booking_id: number;
            user_id: number;
            car_id: number;
            rental_start_date: string;
            rental_end_date: string;
            total_amount: number;  
            status: 'pending' | 'confirmed' | 'cancelled';
        };
};

export const paymentAPI = createApi({
    reducerPath: 'paymentApi',
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
    tagTypes: ['Payment'],
    endpoints: (builder) => ({
        getPayments: builder.query<TIPayment[], void>({
            query: () => '/payments',
            transformResponse: (response: { payments: TIPayment[] }) => response.payments,
            providesTags: ['Payment'],
        }),
        createPayment: builder.mutation<TIPayment, Partial<TIPayment>>({
            query: (newPayment) => ({
                url: '/payments',
                method: 'POST',
                body: newPayment,
            }),
            invalidatesTags: ['Payment'],
        }),
    }),
});

