import { Client, ClientStudies } from '@/schemas/clients';
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
  endpoints: (builder) => ({
    listClients: builder.query<Client[], void>({
      query: () => '/clients',
    }),
    listClientStudies: builder.query<ClientStudies, string>({
      query: (id) => `/client_studies?client_id=${id}`,
    }),
    getClient: builder.query<Client, string>({
      query: (id) => `/clients/${id}`,
    }),
  }),
})

export const {
  useListClientsQuery,
  useGetClientQuery,
  useListClientStudiesQuery,
} = clientsApi
