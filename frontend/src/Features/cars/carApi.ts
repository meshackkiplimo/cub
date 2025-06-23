import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { APIDomain } from "../../utils/APIDomain";
import type { RootState } from "../../app/store";


export type TICar = {
  car_id: string;
  make: string;
  year: string;
  model: string;
  color: string;
  availability: string;
  rental_rate: number;
  location_id: number;
  image_url: string;
  description: string;

}


export const carAPI = createApi({
  reducerPath:'carApi',
  baseQuery:fetchBaseQuery({
    baseUrl:APIDomain,
    prepareHeaders:(headers, {getState})=>{
      const token = (getState() as RootState).user.token;
      if(token){
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;

    }
  }),
  tagTypes:['Car'],
  endpoints:(builder) => ({
    getCars: builder.query<TICar[], void>({
      query: () => '/cars',
      providesTags: ['Car'],
    }),
    getCarById: builder.query<TICar, string>({
      query: (id) => `/cars/${id}`,
      providesTags: (result, error, id) => [{ type: 'Car', id }],
    }),
    createCar: builder.mutation<TICar, FormData>({
  query: (formData) => ({
    url: '/cars',
    method: 'POST',
    body: formData, // ✅ sends multipart/form-data correctly
  }),
  invalidatesTags: ['Car'],
}),

    updateCar: builder.mutation<TICar, Partial<TICar> & { id: string }>({
      query: ({ id, ...patch }) => ({
        url: `/cars/${id}`,
        method: 'PUT',
        body: patch,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Car', id }],
    }),
    deleteCar: builder.mutation<{ success: boolean }, string>({
      query: (id) => ({
        url: `/cars/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Car'],
    }),
  }),
    

})

    


