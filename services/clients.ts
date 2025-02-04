import { Client, ClientStudies, NewClient } from '@/schemas/clients';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import Cookies from 'js-cookie';

export const clientsApi = createApi({
  reducerPath: 'clientsApi',
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
  tagTypes: ['Client'],
  endpoints: (builder) => ({
    listClients: builder.query<Client[], void>({
      query: () => '/clients',
      providesTags: ['Client'],
    }),
    getClient: builder.query<Client, string>({
      query: (id) => `/clients/${id}`,
    }),
    createClient: builder.mutation<void, NewClient>({
      query: (body) => ({
        url: '/clients',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Client'],
    }),
  }),
})

export const {
  useListClientsQuery,
  useGetClientQuery,
  useCreateClientMutation,
} = clientsApi
