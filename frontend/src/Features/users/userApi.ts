import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import { createApi } from "@reduxjs/toolkit/query/react";
import { APIDomain } from "../../utils/APIDomain";




export type TUser = {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  role: string;
  is_verified: boolean;
};
export type TVerify = {
    email: string;
    code: string;
    };

export const UserApi = createApi({
    reducerPath:'userApi',
    baseQuery:fetchBaseQuery({
        baseUrl:APIDomain


    }),
    tagTypes:['Users'],
    endpoints:(builder)=>({
        createUsers:builder.mutation<TUser, Partial<TUser>>({
            query:(newUser)=>({
                url:'/auth/register',
                method:'POST',
                body:newUser

            }),
            invalidatesTags:['Users']

    }),
    verifyUser:builder.mutation<TVerify, { email: string; code: string }>({
        query: ({ email,code }) => ({
            url: '/auth/verify',
            method: 'POST',
            body: { email,code }
        }),
        invalidatesTags: ['Users']
    })
})


})