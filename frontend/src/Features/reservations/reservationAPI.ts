import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";




export type TIReservation = {
  reservation_id: number;
  user_id: number;
  car_id: number;
  reservation_date: string;
  pickup_date: string;
  return_date: string;
  user: {
    user_id: number;
    first_name: string;
    last_name: string;
    email: string;
  };
  car: {
    make: string;
    model: string;
    year: string;
  };
};


export const reservationAPI  = createApi({
    reducerPath: 'reservationApi',
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
    tagTypes: ['Reservation'],
    endpoints: (builder) => ({
        getReservations: builder.query<TIReservation[], void>({
        query: () => '/reservations',
        transformResponse: (response: { reservations: TIReservation[] }) => response.reservations,
        providesTags: ['Reservation'],
        }),
        getReservationById: builder.query<TIReservation, number>({
        query: (id) => `/reservations/${id}`,
        providesTags: (result, error, id) => [{ type: 'Reservation', id }],
        }),
        createReservation: builder.mutation<TIReservation, Partial<TIReservation>>({
        query: (reservation) => ({
            url: '/reservations',
            method: 'POST',
            body: reservation,
        }),
        invalidatesTags: ['Reservation'],
        }),
        updateReservation: builder.mutation<TIReservation, Partial<TIReservation> & { id: number }>({
        query: ({ id, ...patch }) => ({
            url: `/reservations/${id}`,
            method: 'PUT',
            body: patch,
        }),
        invalidatesTags: (result, error, { id }) => [{ type: 'Reservation', id }],
        }),
    })

})