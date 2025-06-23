import { createApi } from "@reduxjs/toolkit/query";
import { update } from "node-persist";


export type TICar = {
  id: string;
}


export const carApi = createApi({
  reducerPath: "carApi",
  baseQuery: async (arg: any) => {
    // Simulate a network request
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ data: [] });
      }, 1000);
    });
  },
  endpoints: (builder) => ({
    getCars: builder.query<TICar[], void>({
      query: () => "/cars",
      providesTags:['Car'],
    }),
    updateCar: builder.mutation<TICar, TICar>({
      query: (updatedcar) => ({
        url: `/cars/${updatedcar.id}`,
        method: 'PUT',
        body: updatedcar,
      }),
      invalidatesTags: ['Car'],
    }),
    createCar: builder.mutation<TICar, Partial<TICar>>({
      query: (newCar) => ({
        url: '/cars',
        method: 'POST',
        body: newCar,
      }),
      invalidatesTags: ['Car'],
    }),
    deleteCar: builder.mutation<void, string>({
      query: (id) => ({
        url: `/cars/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Car'],
    }),
    
  }),


  

})

//  CREATE CAR
