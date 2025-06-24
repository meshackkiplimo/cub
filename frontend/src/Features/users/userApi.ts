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
            url: '/auth/verify-email',
            method: 'POST',
            body: { email,code }
        }),
        invalidatesTags: ['Users']
    }),
       getUsers: builder.query<TUser[], void>({
    query: () => '/users',
    transformResponse: (response: { users: TUser[] }) => response.users,
    providesTags: ['Users']
}),

        updateUserRole:builder.mutation<TUser, { id: number; role: string }>({
            query:({ id, role })=>({
                url:`/users/${id}`,
                method:'PATCH',
                body:{ role }
            }),
            invalidatesTags:['Users']
        }),
        deleteUser:builder.mutation<{ message: string }, number>({
            query:(id)=>({
                url:`/users/${id}`,
                method:'DELETE'
            }),
            invalidatesTags:['Users']
        })
}),




})