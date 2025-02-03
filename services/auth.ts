import { SignInRequest, SignInResponse, User } from '@/schemas/auth'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import Cookies from 'js-cookie';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
    prepareHeaders(headers) {
      const token = Cookies.get('sessionToken')
      if (token) {
        headers.set('authorization', `${token}`)
      }
      return headers
    },
  }),
  endpoints: (builder) => ({
    signIn: builder.mutation<SignInResponse, SignInRequest>({
      query: (body) => ({
        url: '/users/login',
        method: 'POST',
        body,
      }),
    }),
    user: builder.query<User, void>({
      query: () => '/users/me',
    }),
  }),
})

export const {
  useSignInMutation,
  useUserQuery,
} = authApi
